import { Server, Socket } from 'socket.io';
import { getToken } from 'next-auth/jwt';
import { parse as parseCookieHeader } from 'cookie';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData,
	RoomState,
	PlaybackState,
	ConnectedUser,
} from 'types';
import { client } from 'cache';
import { createAdapter } from '@socket.io/redis-adapter';
import 'utils/connect-db';
import User from 'models/User';
import Room from 'models/Room';
import { freshPlayback, positionAt } from 'helpers/playback';
import { YOUTUBE_VIDEO_ID, fetchYouTubeTrack } from 'helpers/server/youtube';
import { updateRoomState } from './roomStore';

type RoomSocket = Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;

// Pressing "previous" this far into a song restarts it instead.
const RESTART_THRESHOLD_SECONDS = 5;

const socketChannel = (slug: string) => `room:${slug}`;

const isAdmin = (state: RoomState, socket: RoomSocket) =>
	state.room.owned_by === socket.data.user_id;

const moveTo = (
	state: RoomState,
	changes: Partial<PlaybackState>,
): RoomState => {
	const now = Date.now();
	return {
		...state,
		playback: {
			...state.playback,
			position: positionAt(state.playback, now),
			updatedAt: now,
			...changes,
		},
	};
};

const neighbourTrackId = (state: RoomState, step: 1 | -1) => {
	const { songsQueue, playback } = state;
	const index = songsQueue.findIndex(
		(track) => track.id === playback.currentSongId,
	);
	if (index === -1 || songsQueue.length === 0) return null;
	return songsQueue[(index + step + songsQueue.length) % songsQueue.length]
		.id;
};

const socketManager = async (_res: any) => {
	if (_res.socket.server.io) {
		console.log('Socket already initialised.');
		return;
	}

	const publisherClient = client;
	const subscriberClient = client.duplicate();

	await subscriberClient
		.connect()
		.then(() => {
			console.log('Subscriber Connected');
		})
		.catch((reason: string) => {
			console.log('Subscriber shows connection error due to ', reason);
		});

	const _io = new Server<
		ClientToServerEvents,
		ServerToClientEvents,
		InterServerEvents,
		SocketData
	>(_res.socket.server, {
		cors: {
			origin:
				process.env.NODE_ENV === 'production'
					? process.env.NEXTAUTH_URL
					: 'http://localhost:3000',
		},
		adapter: createAdapter(publisherClient, subscriberClient),
	});

	_res.socket.server.io = _io;

	const sendQueue = (slug: string, state: RoomState) =>
		_io.to(socketChannel(slug)).emit('queue-updated', state.songsQueue);

	const sendPlayback = (slug: string, state: RoomState) =>
		_io.to(socketChannel(slug)).emit('playback-state', state.playback);

	const sendUsers = (slug: string, state: RoomState) =>
		_io
			.to(socketChannel(slug))
			.emit('sync-room-users-with-redis', state.users_connected);

	_io.use(async (_socket, next) => {
		try {
			// getToken() reads req.cookies (a parsed map), but the raw handshake
			// request only carries the unparsed Cookie header.
			const cookies = parseCookieHeader(
				_socket.request.headers.cookie ?? '',
			);

			const token = await getToken({
				req: { headers: _socket.request.headers, cookies } as any,
				secret: process.env.NEXTAUTH_SECRET,
			});

			if (!token?.email) return next(new Error('Unauthorized'));

			const user = await User.findOne({ email: token.email });

			if (!user) return next(new Error('Unauthorized'));

			_socket.data.user_id = user._id.toString();
			_socket.data.name = user.name;
			_socket.data.email = user.email;
			_socket.data.username = user.username;
			_socket.data.profile_pic = user.profile_pic ?? '';

			next();
		} catch (error) {
			next(new Error('Unauthorized'));
		}
	});

	_io.on('connection', (_socket) => {
		// Every room event acts on the room this socket joined, never on a room id sent by the client.
		const inRoom =
			<T>(handler: (slug: string, payload: T) => Promise<void>) =>
			async (payload: T) => {
				const slug = _socket.data.room_slug;
				if (!slug) return;
				try {
					await handler(slug, (payload ?? {}) as T);
				} catch (error: any) {
					console.error(`room ${slug} event failed:`, error);
					_socket.emit('room-error', {
						message: error?.message ?? 'Something went wrong.',
					});
				}
			};

		_socket.on('time-sync', (ack: (serverNow: number) => void) => {
			if (typeof ack === 'function') ack(Date.now());
		});

		_socket.on(
			'connect-to-join-room',
			async (payload: { room_slug: string }) => {
				const room_slug = payload?.room_slug;
				if (typeof room_slug !== 'string' || _socket.data.room_slug)
					return;

				try {
					const dbRoom = await Room.findOne({ room_slug });

					if (!dbRoom) {
						_socket.emit('error-joining-room', {
							title: 'Room Not Found',
							message: 'This room no longer exists.',
						});
						return;
					}

					_socket.data.room_slug = room_slug;
					_socket.join(socketChannel(room_slug));

					const me: ConnectedUser = {
						socket_id: _socket.id,
						user_id: _socket.data.user_id,
						name: _socket.data.name,
						username: _socket.data.username,
						profile_pic: _socket.data.profile_pic,
					};

					const { state } = await updateRoomState(
						room_slug,
						(current) => {
							const base: RoomState = current ?? {
								room: {
									_id: dbRoom._id.toString(),
									room_slug: dbRoom.room_slug,
									owned_by: dbRoom.owned_by.toString(),
								},
								songsQueue: [],
								playback: freshPlayback(Date.now()),
								users_connected: [],
							};
							return {
								...base,
								users_connected: [
									...base.users_connected.filter(
										(user) => user.socket_id !== _socket.id,
									),
									me,
								],
							};
						},
					);

					if (!state) return;
					_socket.emit('sync-player-with-redis', {
						songsQueue: state.songsQueue,
						playback: state.playback,
					});
					sendUsers(room_slug, state);
				} catch (error) {
					console.error('join failed:', error);
					_socket.emit('error-joining-room', {
						title: 'Could Not Join',
						message:
							'Something went wrong while joining. Please reload.',
					});
				}
			},
		);

		_socket.on('disconnect', async () => {
			const slug = _socket.data.room_slug;
			if (!slug) return;
			try {
				const { state } = await updateRoomState(slug, (current) => {
					if (!current) return undefined;
					const users_connected = current.users_connected.filter(
						(user) => user.socket_id !== _socket.id,
					);
					const updated = { ...current, users_connected };
					// Nobody left listening: freeze the song where it is so the room resumes there.
					return users_connected.length === 0
						? moveTo(updated, { paused: true })
						: updated;
				});
				if (state) sendUsers(slug, state);
			} catch (error) {
				console.error('leave failed:', error);
			}
		});

		_socket.on(
			'add-track',
			inRoom<{ videoId: string; playNow?: boolean }>(
				async (slug, { videoId, playNow }) => {
					if (
						typeof videoId !== 'string' ||
						!YOUTUBE_VIDEO_ID.test(videoId)
					)
						return;

					const track = await fetchYouTubeTrack(videoId);
					if (!track) {
						_socket.emit('room-error', {
							message: 'This video can’t be played inside fplay.',
						});
						return;
					}

					const { state } = await updateRoomState(slug, (current) => {
						if (!current) return undefined;
						const inQueue = current.songsQueue.some(
							(item) => item.id === track.id,
						);
						let next: RoomState = inQueue
							? current
							: {
									...current,
									songsQueue: [
										...current.songsQueue,
										{
											...track,
											addedBy: _socket.data.name,
										},
									],
								};
						if (playNow || !current.playback.currentSongId)
							next = moveTo(next, {
								currentSongId: track.id,
								position: 0,
							});
						return next;
					});

					if (!state) return;
					sendQueue(slug, state);
					sendPlayback(slug, state);
				},
			),
		);

		_socket.on(
			'remove-track',
			inRoom<{ trackId: string }>(async (slug, { trackId }) => {
				const { state, changed } = await updateRoomState(
					slug,
					(current) => {
						if (
							!current ||
							current.playback.currentSongId === trackId
						)
							return undefined;
						const songsQueue = current.songsQueue.filter(
							(track) => track.id !== trackId,
						);
						if (songsQueue.length === current.songsQueue.length)
							return undefined;
						return { ...current, songsQueue };
					},
				);
				if (state && changed) sendQueue(slug, state);
				else if (state) _socket.emit('queue-updated', state.songsQueue);
			}),
		);

		_socket.on(
			'move-track',
			inRoom<{ trackId: string; toIndex: number }>(
				async (slug, { trackId, toIndex }) => {
					const { state, changed } = await updateRoomState(
						slug,
						(current) => {
							if (!current || !Number.isInteger(toIndex))
								return undefined;
							const from = current.songsQueue.findIndex(
								(track) => track.id === trackId,
							);
							if (from === -1) return undefined;
							const songsQueue = [...current.songsQueue];
							const [moved] = songsQueue.splice(from, 1);
							songsQueue.splice(
								Math.max(
									0,
									Math.min(toIndex, songsQueue.length),
								),
								0,
								moved,
							);
							return { ...current, songsQueue };
						},
					);
					if (state && changed) sendQueue(slug, state);
					else if (state)
						_socket.emit('queue-updated', state.songsQueue);
				},
			),
		);

		_socket.on(
			'select-track',
			inRoom<{ trackId: string }>(async (slug, { trackId }) => {
				const { state, changed } = await updateRoomState(
					slug,
					(current) => {
						if (
							!current ||
							current.playback.currentSongId === trackId ||
							!current.songsQueue.some(
								(track) => track.id === trackId,
							)
						)
							return undefined;
						return moveTo(current, {
							currentSongId: trackId,
							position: 0,
						});
					},
				);
				if (state && changed) sendPlayback(slug, state);
			}),
		);

		// "skip" and "track-ended" name the song they refer to, so a repeated or late
		// message is ignored instead of skipping again (every listener reports the end).
		_socket.on(
			'skip',
			inRoom<{ direction: 'next' | 'prev'; fromTrackId: string }>(
				async (slug, { direction, fromTrackId }) => {
					const { state, changed } = await updateRoomState(
						slug,
						(current) => {
							if (
								!current ||
								current.playback.currentSongId !== fromTrackId
							)
								return undefined;
							if (
								direction === 'prev' &&
								positionAt(current.playback, Date.now()) >
									RESTART_THRESHOLD_SECONDS
							)
								return moveTo(current, { position: 0 });
							const target = neighbourTrackId(
								current,
								direction === 'prev' ? -1 : 1,
							);
							return target
								? moveTo(current, {
										currentSongId: target,
										position: 0,
									})
								: undefined;
						},
					);
					if (state && changed) sendPlayback(slug, state);
				},
			),
		);

		_socket.on(
			'track-ended',
			inRoom<{ trackId: string }>(async (slug, { trackId }) => {
				const { state, changed } = await updateRoomState(
					slug,
					(current) => {
						if (
							!current ||
							current.playback.currentSongId !== trackId
						)
							return undefined;
						const target = neighbourTrackId(current, 1);
						return target
							? moveTo(current, {
									currentSongId: target,
									position: 0,
								})
							: undefined;
					},
				);
				if (state && changed) sendPlayback(slug, state);
			}),
		);

		_socket.on(
			'play',
			inRoom<void>(async (slug) => {
				const { state, changed } = await updateRoomState(
					slug,
					(current) => {
						if (
							!current ||
							!isAdmin(current, _socket) ||
							!current.playback.paused ||
							!current.playback.currentSongId
						)
							return undefined;
						return moveTo(current, { paused: false });
					},
				);
				if (state && changed) sendPlayback(slug, state);
			}),
		);

		_socket.on(
			'pause',
			inRoom<void>(async (slug) => {
				const { state, changed } = await updateRoomState(
					slug,
					(current) => {
						if (
							!current ||
							!isAdmin(current, _socket) ||
							current.playback.paused
						)
							return undefined;
						return moveTo(current, { paused: true });
					},
				);
				if (state && changed) sendPlayback(slug, state);
			}),
		);

		_socket.on(
			'seek',
			inRoom<{ position: number }>(async (slug, { position }) => {
				const { state, changed } = await updateRoomState(
					slug,
					(current) => {
						if (
							!current ||
							!isAdmin(current, _socket) ||
							typeof position !== 'number' ||
							!Number.isFinite(position)
						)
							return undefined;
						const track = current.songsQueue.find(
							(item) =>
								item.id === current.playback.currentSongId,
						);
						if (!track) return undefined;
						return moveTo(current, {
							position: Math.max(
								0,
								Math.min(position, track.duration),
							),
						});
					},
				);
				if (state && changed) sendPlayback(slug, state);
			}),
		);
	});
};

export default socketManager;
