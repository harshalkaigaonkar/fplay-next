import RoomHeader from 'components/header/room';
import HeadlessModal from 'components/modal/HeadlessModal';
import { useSocket } from 'hooks/useSocket';
import { useRouter } from 'next/router';
import React, {
	FC,
	MutableRefObject,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	onAddSongIntoQueue,
	onRemoveSongFromQueue,
	onRefreshPlayer,
	onSetupPlayer,
	selectPlayer,
	selectSongsQueue,
	onReaarrangeSongQueue,
	onChangeClickedSongFromQueue,
	onChangeNextSongFromQueue,
	onChangePrevSongFromQueue,
	onSetPlay,
	selectTime,
} from 'redux/slice/playerSlice';
import {
	onChangeUsers,
	onJoiningRoom,
	onLeaveUser,
	selectRoomInfo,
} from 'redux/slice/roomSlice';
import { MongooseRoomTypes, MongooseUserTypes, UseSession } from 'types';

interface RoomLayoutProps {
	session: UseSession;
	room: MongooseRoomTypes;
	children: ReactNode;
	audioElementRef: MutableRefObject<HTMLAudioElement | null>;
	user: MongooseUserTypes;
}

const RoomLayout: FC<RoomLayoutProps> = ({
	session,
	children,
	room,
	audioElementRef,
	user,
}) => {
	const [error, setError] = useState<
		false | { title: string; message: string }
	>(false);

	const songsQueue = useSelector(selectSongsQueue);
	const dispatch = useDispatch();
	const roomInfo = useSelector(selectRoomInfo);
	const socket = useSocket();
	const player = useSelector(selectPlayer);
	const time = useSelector(selectTime);
	const router = useRouter();

	useEffect(() => {
		if (Object.keys(roomInfo).length === 0) dispatch(onJoiningRoom(room));
		if (socket) {
			socketRoomInitializer();
		}
		return () => {
			socket?.disconnect();
			router?.back();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	const onCloseUserExistsModal = () => {
		setError(false);
		router.push('/');
	};

	const socketRoomInitializer = useCallback(async () => {
		socket.emit('connect-to-join-room', {
			user,
			room,
		});

		socket.on(
			'error-joining-room',
			(res: false | { title: string; message: string }) => {
				setError(res);
			},
		);

		socket.on('get-spotlight', () => {
			console.log("You've got the spotlight");
		});

		socket.on('leaves-room', (res: any) => {
			if (typeof res === 'string') {
				console.log(`${res} socket_id left the room.`);
				return;
			}
			dispatch(onLeaveUser(res.socket_id));
			// will use for multiple users
			// dispatch(onRefreshPlayer());
			console.log('leaves-room', res);
		});
		socket.on('sync-player-with-redis', (res: any) => {
			const { songsQueue, currentSongId, paused, time } = res;

			console.log('Sync Redis', {
				songsQueue,
				currentSongId,
				paused,
				time,
			});

			dispatch(
				onSetupPlayer({
					songsQueue,
					currentSongId,
					paused,
					time,
				}),
			);

			console.log('sync-player-with-redis', res);
		});

		socket.on('sync-room-users-with-redis', (res: any) => {
			dispatch(onChangeUsers(res));

			console.log('sync-room-users-with-redis', res);
		});

		socket.on('add-song-in-queue', (song: any) => {
			dispatch(onAddSongIntoQueue([song]));
		});

		socket.on('remove-song-from-queue', (song: any) => {
			console.log('id_to_remove', song);
			try {
				dispatch(onRemoveSongFromQueue(song));
			} catch (err) {
				console.log(err);
			}
		});

		socket.on('replace-song-in-queue', (res: any) => {
			const { replace_from, to_replace } = res;
			console.log('Came here', res);
			dispatch(
				onReaarrangeSongQueue({
					indexReplacedFrom: replace_from,
					indexReplacedTo: to_replace,
				}),
			);
		});

		socket.on('current-song-id-change', (song_id: any) => {
			console.log('Current Song Id Change', song_id);
			dispatch(onChangeClickedSongFromQueue(song_id));
		});

		socket.on('current-song-change-next', (song_id: any) => {
			console.log('Current next song id:', song_id);
			dispatch(onChangeNextSongFromQueue());
		});

		socket.on('current-song-change-prev', (song_id: any) => {
			console.log('Current prev song id:', song_id);
			dispatch(onChangePrevSongFromQueue());
		});

		socket.on('play-current-song', () => {
			console.log('Current Song Playing');
			audioElementRef.current?.play();
		});

		socket.on('pause-current-song', () => {
			console.log('Current Song Paused');
			audioElementRef.current?.pause();
		});

		socket.on('seek-current-song', (time: number) => {
			console.log('audio seeking log');
			if (!!audioElementRef.current) audioElementRef.current.currentTime = time;
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return (
		<div className='lg:mx-20 lg:px-20 lg:flex lg:flex-col min-h-screen md:m-0 md:p-0 select-none animate-enter-opacity'>
			<RoomHeader
				session={session}
				room={room}
			/>
			<main>{children}</main>
			{error && (
				<HeadlessModal
					isOpen={!!error}
					title={"You're Already in the Room"}
					cta={'disconnect'}
					cta_function={onCloseUserExistsModal}>
					<>
						<p className='text-xs'>{!!error && error.message}</p>
					</>
				</HeadlessModal>
			)}
		</div>
	);
};

export default RoomLayout;
