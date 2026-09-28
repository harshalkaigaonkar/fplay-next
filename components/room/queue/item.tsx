import { PauseIcon, PlayIcon, TrashIcon } from '@heroicons/react/20/solid';
import DragIcon from 'components/icon/dragIcon';
import SongPlaying from 'components/icon/playing';
import { useSocket } from 'hooks/useSocket';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
	onRemoveFromQueue,
	selectCurrentSongId,
	selectPaused,
} from 'redux/slice/playerSlice';
import { selectIsAdmin } from 'redux/slice/roomSlice';
import { QueueTrack } from 'types';

type DraggableListItemProps = {
	track: QueueTrack;
	index: number;
	fromPanel?: boolean;
};

const DraggableListItem: FC<DraggableListItemProps> = ({
	track,
	index,
	fromPanel,
}) => {
	const currentTrackId = useSelector(selectCurrentSongId);
	const paused = useSelector(selectPaused);
	const isAdmin = useSelector(selectIsAdmin);
	const socket = useSocket();
	const dispatch = useDispatch();

	const [showPlay, setShowPlay] = useState<boolean>(false);
	const isCurrent = track.id === currentTrackId;

	const onClickHandler = () => {
		if (!isCurrent) {
			socket.emit('select-track', { trackId: track.id });
			return;
		}
		if (isAdmin) socket.emit(paused ? 'play' : 'pause');
	};

	const deleteHandler = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (isCurrent) return;
		dispatch(onRemoveFromQueue(track.id));
		socket.emit('remove-track', { trackId: track.id });
	};

	const overlayIcon =
		!isCurrent || paused ? (
			<PlayIcon className='w-6 h-6' />
		) : (
			<PauseIcon className='w-6 h-6' />
		);

	return (
		<Draggable
			draggableId={track.id}
			index={index}>
			{(provided) => (
				<li
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={`${isCurrent ? 'scale-105 bg-white/10 ' : 'scale-100 bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-xl '} my-1 py-2 px-4 inline-flex flex-row items-center rounded-md transition ease-in-out duration-700`}
					onMouseEnter={() => setShowPlay(true)}
					onMouseLeave={() => setShowPlay(false)}
					onClick={onClickHandler}>
					<section className='w-3/4 inline-flex flex-row gap-5 items-center'>
						<span className='relative inline-flex flex-col m-0 p-0 cursor-grab active:cursor-grabbing'>
							<DragIcon className='w-5 h-5' />
						</span>
						<span className='relative flex-none'>
							{showPlay && (
								<span className='absolute inset-0 inline-flex items-center justify-center cursor-pointer bg-black/50 rounded-md z-10 animate-enter-div-2'>
									{overlayIcon}
								</span>
							)}
							{!showPlay && fromPanel && isCurrent && !paused && (
								<span className='absolute inset-0 inline-flex items-center justify-center bg-black/50 rounded-md z-10 animate-enter-div-2'>
									<SongPlaying type={3} />
								</span>
							)}
							<Image
								src={track.thumbnail}
								alt=''
								width={80}
								height={45}
								className='rounded-md overflow-hidden object-cover z-0'
								loading='lazy'
							/>
						</span>
						<span className='max-w-24 w-full inline-flex flex-col gap-2 truncate'>
							<h5 className='w-full font-semibold truncate'>
								{track.title}
							</h5>
							<h6 className='w-full font-normal truncate'>
								{track.channel}
								{track.addedBy ? ` · ${track.addedBy}` : ''}
							</h6>
						</span>
					</section>
					<div className='flex-0' />
					<section className='w-1/4 inline-flex flex-row justify-end gap-5'>
						{isCurrent && !paused && !fromPanel && (
							<span className='inline-flex items-center justify-center bg-inherit animate-enter-div'>
								<SongPlaying type={3} />
							</span>
						)}
						{!isCurrent && (
							<button
								type='button'
								aria-label={`Remove ${track.title}`}
								onClick={deleteHandler}
								className='inline-flex items-center rounded-md px-3 py-2 text-white hover:bg-[#232323] bg-transparent border-none cursor-pointer'>
								<TrashIcon className='w-4 h-4' />
							</button>
						)}
					</section>
				</li>
			)}
		</Draggable>
	);
};

export default DraggableListItem;
