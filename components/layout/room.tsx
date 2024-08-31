import RoomHeader from 'components/header/room';
import HeadlessModal from 'components/modal/HeadlessModal';
import initialize_room_for_user from 'helpers/rtdb/initialize_room_for_user';
import sync_room_when_user_leaves from 'helpers/rtdb/sync_room_when_user_leaves';
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
import { rdbClient } from 'rt-functions';
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
	const player = useSelector(selectPlayer);
	const time = useSelector(selectTime);
	const router = useRouter();

	useEffect(() => {
		const warningText =
			'You are currently in a room - are you sure you wish to leave this page?';

		const handleSyncUser = async () => {
			console.log("console.log('called');");
			// TODO: add the rtdb function for removing user
			await sync_room_when_user_leaves({ userId: user._id });
			console.log('user removed from session');
		};

		const handleRouteChangeStart = () => {
			if (!window.confirm(warningText)) {
				router.events.emit('routeChangeError');
			}
			// removing the user for both the cases of alert here

			handleSyncUser();
		};

		const handleWindowClose = (e: any) => {
			e.preventDefault();
			window.addEventListener('unload', handleSyncUser);
			e.returnValue = warningText;
			return warningText;
		};
		window.addEventListener('beforeunload', handleWindowClose);
		router.events.on('routeChangeStart', handleRouteChangeStart);

		return () => {
			window.removeEventListener('beforeunload', handleWindowClose);
			window.removeEventListener('unload', handleSyncUser);
			router.events.off('routeChangeStart', handleRouteChangeStart);
		};
	}, [router.events]);

	const handle_initialize_room_for_user = async () => {
		// const room_slug = room.room_slug;
		// const { data: rtdb_sessionId } = await get_session_id_for_room({
		// 	roomSlug: room_slug,
		// });
		// if (!rtdb_sessionId) {
		await initialize_room_for_user({
			roomInfo: room,
			userInfo: user,
		});
	};
	// };

	useEffect(() => {
		if (Object.keys(roomInfo).length === 0) dispatch(onJoiningRoom(room));
		// console.log({ room, user });
		if (rdbClient) {
			handle_initialize_room_for_user();
			listenersInitializer();
		}
		return () => {
			// socket?.disconnect();
			// router?.back();
		};
	}, [router]);

	const onCloseUserExistsModal = () => {
		setError(false);
		router.push('/');
	};

	const listenersInitializer = useCallback(async () => {
		// socket.emit('connect-to-join-room', {
		// 	user,
		// 	room,
		// });
		// socket.on(
		// 	'error-joining-room',
		// 	(res: false | { title: string; message: string }) => {
		// 		setError(res);
		// 	},
		// );
		// socket.on('get-spotlight', () => {
		// 	console.log("You've got the spotlight");
		// });
		// socket.on('leaves-room', (res: any) => {
		// 	if (typeof res === 'string') {
		// 		console.log(`${res} socket_id left the room.`);
		// 		return;
		// 	}
		// 	dispatch(onLeaveUser(res.socket_id));
		// 	// will use for multiple users
		// 	// dispatch(onRefreshPlayer());
		// 	console.log('leaves-room', res);
		// });
		// socket.on('sync-player-with-redis', (res: any) => {
		// 	const { songsQueue, currentSongId, paused, time } = res;
		// 	console.log('Sync Redis', {
		// 		songsQueue,
		// 		currentSongId,
		// 		paused,
		// 		time,
		// 	});
		// 	dispatch(
		// 		onSetupPlayer({
		// 			songsQueue,
		// 			currentSongId,
		// 			paused,
		// 			time,
		// 		}),
		// 	);
		// 	console.log('sync-player-with-redis', res);
		// });
		// socket.on('sync-room-users-with-redis', (res: any) => {
		// 	dispatch(onChangeUsers(res));
		// 	console.log('sync-room-users-with-redis', res);
		// });
		// socket.on('add-song-in-queue', (song: any) => {
		// 	dispatch(onAddSongIntoQueue([song]));
		// });
		// socket.on('remove-song-from-queue', (song: any) => {
		// 	console.log('id_to_remove', song);
		// 	try {
		// 		dispatch(onRemoveSongFromQueue(song));
		// 	} catch (err) {
		// 		console.log(err);
		// 	}
		// });
		// socket.on('replace-song-in-queue', (res: any) => {
		// 	const { replace_from, to_replace } = res;
		// 	console.log('Came here', res);
		// 	dispatch(
		// 		onReaarrangeSongQueue({
		// 			indexReplacedFrom: replace_from,
		// 			indexReplacedTo: to_replace,
		// 		}),
		// 	);
		// });
		// socket.on('current-song-id-change', (song_id: any) => {
		// 	console.log('Current Song Id Change', song_id);
		// 	dispatch(onChangeClickedSongFromQueue(song_id));
		// });
		// socket.on('current-song-change-next', (song_id: any) => {
		// 	console.log('Current next song id:', song_id);
		// 	dispatch(onChangeNextSongFromQueue());
		// });
		// socket.on('current-song-change-prev', (song_id: any) => {
		// 	console.log('Current prev song id:', song_id);
		// 	dispatch(onChangePrevSongFromQueue());
		// });
		// socket.on('play-current-song', () => {
		// 	console.log('Current Song Playing');
		// 	audioElementRef.current?.play();
		// });
		// socket.on('pause-current-song', () => {
		// 	console.log('Current Song Paused');
		// 	audioElementRef.current?.pause();
		// });
		// socket.on('seek-current-song', (time: number) => {
		// 	console.log('audio seeking log');
		// 	if (!!audioElementRef.current)
		// 		audioElementRef.current.currentTime = time;
		// });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
