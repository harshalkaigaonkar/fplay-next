import RoomHeader from 'components/header/room';
import HeadlessModal from 'components/modal/HeadlessModal';
import { syncClock } from 'helpers/roomClock';
import { useSocket } from 'hooks/useSocket';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	onPlaybackUpdated,
	onQueueUpdated,
	onSetupPlayer,
} from 'redux/slice/playerSlice';
import {
	onChangeUsers,
	onJoiningRoom,
	onSetAdmin,
	selectRoomInfo,
} from 'redux/slice/roomSlice';
import { MongooseRoomTypes, MongooseUserTypes, UseSession } from 'types';

interface RoomLayoutProps {
	session: UseSession;
	room: MongooseRoomTypes;
	children: ReactNode;
	user: MongooseUserTypes;
}

const RoomLayout: FC<RoomLayoutProps> = ({ session, children, room, user }) => {
	const [error, setError] = useState<
		false | { title: string; message: string }
	>(false);

	const dispatch = useDispatch();
	const roomInfo = useSelector(selectRoomInfo);
	const socket = useSocket();
	const router = useRouter();
	const [notice, setNotice] = useState<string | null>(null);

	useEffect(() => {
		if (Object.keys(roomInfo).length === 0) dispatch(onJoiningRoom(room));
		dispatch(
			onSetAdmin(
				!!user &&
					!!room?.owned_by &&
					`${room.owned_by._id}` === `${user._id}`,
			),
		);
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
		socket.on('error-joining-room', (res) => {
			setError(res);
		});

		socket.on('room-error', ({ message }) => {
			setNotice(message);
			setTimeout(() => setNotice(null), 4000);
		});

		socket.on('sync-player-with-redis', (res) => {
			dispatch(onSetupPlayer(res));
		});

		socket.on('sync-room-users-with-redis', (res) => {
			dispatch(onChangeUsers(res));
		});

		socket.on('queue-updated', (queue) => {
			dispatch(onQueueUpdated(queue));
		});

		socket.on('playback-state', (playback) => {
			dispatch(onPlaybackUpdated(playback));
		});

		// Measure the clock gap to the server before joining, so the first position is right.
		await syncClock(socket);
		if (room?.room_slug)
			socket.emit('connect-to-join-room', { room_slug: room.room_slug });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return (
		<div className='lg:mx-20 lg:px-20 lg:flex lg:flex-col min-h-screen md:m-0 md:p-0 select-none animate-enter-opacity'>
			<RoomHeader
				session={session}
				room={room}
			/>
			<main>{children}</main>
			{notice && (
				<p
					role='status'
					className='fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-md bg-black/80 text-sm'>
					{notice}
				</p>
			)}
			{error && (
				<HeadlessModal
					isOpen={!!error}
					title={error ? error.title : ''}
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
