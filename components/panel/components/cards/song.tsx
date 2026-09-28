import { CheckIcon, PlayIcon } from '@heroicons/react/20/solid';
import AddToPlaylistIcon from 'components/icon/addToPlaylist';
import SongPlaying from 'components/icon/playing';
import { secToMin } from 'helpers';
import { useSocket } from 'hooks/useSocket';
import Image from 'next/image';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import {
	selectCurrentSongId,
	selectPaused,
	selectSongsQueue,
} from 'redux/slice/playerSlice';
import { QueueTrack } from 'types';

const PanelSongResult: FC<{ track: QueueTrack }> = ({ track }) => {
	const songsQueue = useSelector(selectSongsQueue);
	const currentSongId = useSelector(selectCurrentSongId);
	const paused = useSelector(selectPaused);
	const socket = useSocket();

	const inQueue = songsQueue.some((item: QueueTrack) => item.id === track.id);
	const isPlaying = currentSongId === track.id && !paused;

	return (
		<div className='w-full h-20 my-1 px-3 bg-[#121212] hover:bg-[#343434] flex flex-row items-center gap-3 overflow-hidden rounded-lg transition duration-500'>
			<Image
				src={track.thumbnail}
				alt=''
				width={96}
				height={54}
				className='rounded-md object-cover flex-none'
				loading='lazy'
			/>
			<span className='flex-1 min-w-0'>
				<p className='text-sm font-bold truncate'>{track.title}</p>
				<p className='mt-1 text-xs font-normal truncate opacity-70'>
					{track.channel} · {secToMin(track.duration)}
				</p>
			</span>
			{isPlaying && <SongPlaying type={3} />}
			<button
				type='button'
				aria-label={`Play ${track.title} now`}
				title='Play now'
				onClick={() =>
					socket.emit('add-track', {
						videoId: track.id,
						playNow: true,
					})
				}
				className='p-2 h-fit rounded-full bg-black border-none inline-flex items-center cursor-pointer hover:bg-black/30 active:bg-black/60'>
				<PlayIcon className='w-5 h-5 text-white' />
			</button>
			{inQueue ? (
				<span
					title='In the queue'
					className='p-2 h-fit rounded-full bg-black inline-flex items-center'>
					<CheckIcon className='w-5 h-5 text-white' />
				</span>
			) : (
				<button
					type='button'
					aria-label={`Add ${track.title} to the queue`}
					title='Add to queue'
					onClick={() =>
						socket.emit('add-track', { videoId: track.id })
					}
					className='p-2 h-fit rounded-full bg-black border-none inline-flex items-center cursor-pointer hover:bg-black/30 active:bg-black/60'>
					<AddToPlaylistIcon className='w-5 h-5 text-white' />
				</button>
			)}
		</div>
	);
};

export default PanelSongResult;
