export {};
// import { Server } from 'socket.io';
// import {
// 	ClientToServerEvents,
// 	ServerToClientEvents,
// 	InterServerEvents,
// 	SocketData,
// } from 'types';
// import redisManager, { client } from 'rt-functions';
// import { createAdapter } from '@socket.io/redis-adapter';

// type ConnectedUser = {
// 	user_id: string;
// 	socket_id: string;
// 	name: string;
// 	email: string;
// 	username: string;
// 	profile_pic: string;
// };

// const socketManager = async (_res: any) => {
// 	if (_res.socket.server.io) {
// 		console.log('Socket already initialised.');
// 		return;
// 	}

// 	const publisherClient = client;
// 	const subscriberClient = client.duplicate();

// 	await subscriberClient
// 		.connect()
// 		.then(() => {
// 			console.log('Subscriber Connected');
// 		})
// 		.catch((reason: string) => {
// 			console.log('Subscriber shows connection error due to ', reason);
// 		});

// 	const _io = new Server<
// 		ClientToServerEvents,
// 		ServerToClientEvents,
// 		InterServerEvents,
// 		SocketData
// 	>(_res.socket.server, {
// 		cors: {
// 			origin: `${process.env.NODE_ENV === 'production' ? `/` : `http://localhost:3000`}`,
// 		},
// 		pingTimeout: 60000 * 720, // 0.5 day
// 		adapter: createAdapter(publisherClient, subscriberClient),
// 	});

// 	_res.socket.server.io = _io;

// 	_io.on('connection', (_socket) => {
// 		console.log('new Socket Client Connected', _socket.id);

// 		// connection and disconnnect socket event handlers

// 		_socket.on('connect-to-join-room', async (res: any) => {
// 			const { user, room } = res;
// 			// client joins the room.
// 			_socket.join(`room:${room.room_slug}`);
// 			// socketClient - roomId relation
// 			await client.json.set(
// 				`user:${_socket.id}`,
// 				'$',
// 				`room:${room.room_slug}`,
// 			);
// 			let roomCache = await client.json.get(`room:${room.room_slug}`);
// 			let new_room_created: boolean = false;
// 			if (!roomCache) {
// 				// if no rrom exists, create one.
// 				roomCache = await client.json.set(
// 					`room:${room.room_slug}`,
// 					'$',
// 					{
// 						// active: true, - as anyone joins, room automatically gets active.
// 						songsQueue: [],
// 						currentSongId: null,
// 						paused: true,
// 						time: 0,
// 						users_connected: [],
// 						room: {
// 							...Object.fromEntries(
// 								Object.entries(room).filter(([item]) =>
// 									['_id', 'room_slug'].includes(item),
// 								),
// 							),
// 							owned_by: room.owned_by._id,
// 						},
// 					},
// 				);
// 				new_room_created = true;
// 			}
// 			const new_user_connection = {
// 				socket_id: _socket.id,
// 				user_id: user._id,
// 				...Object.fromEntries(
// 					Object.entries(user).filter(
// 						([item]) =>
// 							![
// 								'_id',
// 								'createdAt',
// 								'updatedAt',
// 								'library',
// 								'__v',
// 							].includes(item),
// 					),
// 				),
// 			};
// 			// append user's connection in the room.
// 			await client.json.arrAppend(
// 				`room:${room.room_slug}`,
// 				'.users_connected',
// 				new_user_connection,
// 			);
// 			// getting updated room cache.
// 			roomCache = await client.json.get(`room:${room.room_slug}`);
// 			const { songsQueue, currentSongId, paused, time, users_connected } =
// 				roomCache as any;

// 			// response emits to client
// 			console.log(
// 				`socket id: ${_socket.id} connected to room id: ${room.room_slug}`,
// 			);
// 			_socket.emit('sync-player-with-redis', {
// 				songsQueue,
// 				currentSongId,
// 				paused,
// 				time,
// 			});
// 			_io.to(`room:${room.room_slug}`).emit(
// 				'sync-room-users-with-redis',
// 				users_connected,
// 			);
// 		});

// 		_socket.on('disconnect', async (reason) => {
// 			const room: string | null | any = await client.json.get(
// 				`user:${_socket.id}`,
// 			);
// 			let left_user: string | ConnectedUser | any = _socket.id;
// 			if (room) {
// 				const { users_connected }: any = await client.json.get(room);
// 				left_user = await client.json.arrPop(
// 					room,
// 					'.users_connected',
// 					users_connected.findIndex(
// 						(item: ConnectedUser) => item.socket_id === _socket.id,
// 					),
// 				);
// 				if (users_connected.length === 1)
// 					await Promise.all([
// 						/**
// 						 * persist data in the room even if all users leave room.
// 						 * */
// 						// client.json.set(room, ".songsQueue", []),
// 						// client.json.set(room, ".currentSongId", null),
// 						client.json.set(room, '.paused', true),
// 						client.json.set(room, '.time', 0),
// 					]);
// 				await client.json.del(`user:${_socket.id}`);
// 			}
// 			console.log(
// 				`user ${left_user.user_id} left from room id: ${room}`,
// 				left_user,
// 				`due to this reason : ${reason}`,
// 			);
// 			_io.to(room).emit('leaves-room', left_user);
// 		});

// 		// queue socket events

// 		_socket.on('on-add-song-in-queue', async (res: any) => {
// 			const { songObj: song, room_id } = res;
// 			let room: any = await client.json.get(`room:${room_id}`);
// 			if (room?.songsQueue.length === 0)
// 				await client.json.set(
// 					`room:${room_id}`,
// 					'.currentSongId',
// 					song.id,
// 				);
// 			await client.json.arrAppend(`room:${room_id}`, '.songsQueue', song);
// 			_socket.broadcast
// 				.to(`room:${room_id}`)
// 				.emit('add-song-in-queue', song);
// 		});

// 		_socket.on('on-remove-song-from-queue', async (res: any) => {
// 			const { song_id, room_id } = res;
// 			const { songsQueue }: any = await client.json.get(
// 				`room:${room_id}`,
// 			);
// 			await client.json.arrPop(
// 				`room:${room_id}`,
// 				'.songsQueue',
// 				songsQueue.findIndex((item: any) => item.id === song_id),
// 			);
// 			_socket.broadcast
// 				.to(`room:${room_id}`)
// 				.emit('remove-song-from-queue', song_id);
// 		});

// 		_socket.on('on-replace-song-in-queue', async (res: any) => {
// 			const { replace_from, to_replace, room_id } = res;
// 			let replacePart: any = await client.json.arrPop(
// 				`room:${room_id}`,
// 				'.songsQueue',
// 				replace_from,
// 			);
// 			console.log('res', replacePart.id);
// 			await client.json.arrInsert(
// 				`room:${room_id}`,
// 				'.songsQueue',
// 				to_replace,
// 				replacePart,
// 			);
// 			_socket.broadcast
// 				.to(`room:${room_id}`)
// 				.emit('replace-song-in-queue', {
// 					replace_from,
// 					to_replace,
// 				});
// 		});

// 		_socket.on('on-current-song-id-change', async (res: any) => {
// 			const { song_id, room_id } = res;
// 			await client.json.set(`room:${room_id}`, '.currentSongId', song_id);
// 			_socket.broadcast
// 				.to(`room:${room_id}`)
// 				.emit('current-song-id-change', song_id);
// 		});

// 		_socket.on('on-current-song-change-next', async (res: any) => {
// 			const { room_id } = res;
// 			const { currentSongId, songsQueue }: any = await client.json.get(
// 				`room:${room_id}`,
// 			);
// 			let index = await songsQueue.findIndex(
// 				(song: any) => song.id === currentSongId,
// 			);
// 			let nextSongId;
// 			if (index + 1 < songsQueue.length) {
// 				nextSongId = songsQueue[index + 1].id;
// 			} else {
// 				nextSongId = songsQueue[0].id;
// 			}
// 			await client.json.set(
// 				`room:${room_id}`,
// 				'.currentSongId',
// 				nextSongId,
// 			);
// 			_socket.broadcast
// 				.to(`room:${room_id}`)
// 				.emit('current-song-change-next', nextSongId);
// 		});

// 		_socket.on('on-current-song-change-prev', async (res: any) => {
// 			const { room_id } = res;
// 			const { currentSongId, songsQueue }: any = await client.json.get(
// 				`room:${room_id}`,
// 			);
// 			let index = await songsQueue.findIndex(
// 				(song: any) => song.id === currentSongId,
// 			);
// 			let prevSongId;
// 			if (index - 1 >= 0) {
// 				prevSongId = songsQueue[index - 1].id;
// 			} else {
// 				prevSongId = songsQueue[songsQueue.length - 1].id;
// 			}
// 			await client.json.set(
// 				`room:${room_id}`,
// 				'.currentSongId',
// 				prevSongId,
// 			);
// 			_socket.broadcast
// 				.to(`room:${room_id}`)
// 				.emit('current-song-change-prev', prevSongId);
// 		});

// 		_socket.on('on-play-current-song', async (res: any) => {
// 			const { room_id, user_id } = res;
// 			const { room }: any = await client.json.get(`room:${room_id}`);
// 			const { owned_by } = room ?? {};
// 			if (owned_by === user_id) {
// 				await client.json.set(`room:${room_id}`, '.paused', false);
// 				_socket.broadcast
// 					.to(`room:${room_id}`)
// 					.emit('play-current-song');
// 			}
// 		});

// 		_socket.on('on-pause-current-song', async (res: any) => {
// 			const { room_id, user_id } = res;
// 			const { room }: any = await client.json.get(`room:${room_id}`);
// 			const { owned_by } = room ?? {};
// 			if (owned_by === user_id) {
// 				await client.json.set(`room:${room_id}`, '.paused', true);
// 				_socket.broadcast
// 					.to(`room:${room_id}`)
// 					.emit('pause-current-song');
// 			}
// 		});

// 		_socket.on('on-seek-current-song', async (res: any) => {
// 			const { room_id, time, user_id, broadcast } = res;
// 			const { room }: any = await client.json.get(`room:${room_id}`);
// 			const { owned_by } = room ?? {};
// 			if (owned_by === user_id) {
// 				await client.json.set(`room:${room_id}`, '.time', time);

// 				if (!!broadcast)
// 					_socket.broadcast
// 						.to(`room:${room_id}`)
// 						.emit('seek-current-song', time);
// 			}
// 		});
// 	});
// };

// export default socketManager;
