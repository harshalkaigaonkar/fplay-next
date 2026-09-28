import {
	ChevronLeftIcon,
	ChevronRightIcon,
	HeartIcon,
	MagnifyingGlassIcon,
	PauseIcon,
	PlayIcon,
	SpeakerWaveIcon,
	SpeakerXMarkIcon,
} from '@heroicons/react/20/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import { secToMin } from 'helpers';
import { useSocket } from 'hooks/useSocket';
import React, { FC, ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPaused, selectTime } from 'redux/slice/playerSlice';
import { onOpenPanel, selectIsAdmin } from 'redux/slice/roomSlice';
import { QueueTrack } from 'types';

type AudioPlayerProps = {
	currentTrack: QueueTrack | null;
	videoSlot: ReactNode;
	muted: boolean;
	onToggleMute: () => void;
};

const AudioPlayer: FC<AudioPlayerProps> = ({
	currentTrack,
	videoSlot,
	muted,
	onToggleMute,
}) => {
	const paused = useSelector(selectPaused);
	const currentTime = useSelector(selectTime);
	const isAdmin = useSelector(selectIsAdmin);
	const socket = useSocket();
	const dispatch = useDispatch();

	const [liked, setLiked] = useState<boolean>(false); //to redux later
	const [dragTime, setDragTime] = useState<number | null>(null);

	const onTogglePlay = () => {
		if (!isAdmin) return;
		socket.emit(paused ? 'play' : 'pause');
	};

	const onSkip = (direction: 'next' | 'prev') => {
		if (!currentTrack) return;
		socket.emit('skip', { direction, fromTrackId: currentTrack.id });
	};

	const onCommitSeek = () => {
		if (dragTime === null) return;
		socket.emit('seek', { position: dragTime });
		setDragTime(null);
	};

	return (
		<div className='h-full w-full mt-5 px-5 py-8 flex flex-col items-center gap-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-[40px]'>
			<div
				className={`${currentTrack ? '' : 'hidden'} w-full flex flex-col items-center gap-2`}>
				<span className='w-full h-fit inline-flex flex-row items-center justify-evenly gap-2'>
					<button
						type='button'
						aria-label='Previous song'
						onClick={() => onSkip('prev')}
						className='p-2 inline-flex items-center h-fit bg-transparent border-none text-white/70 rounded-full hover:-translate-x-1 hover:bg-white/5 cursor-pointer transition duration-500 active:bg-[#121212]'>
						<ChevronLeftIcon className='w-14 h-14' />
					</button>
					{videoSlot}
					<button
						type='button'
						aria-label='Next song'
						onClick={() => onSkip('next')}
						className='p-2 inline-flex items-center h-fit bg-transparent border-none text-white/70 rounded-full hover:translate-x-1 hover:bg-white/5 cursor-pointer transition duration-500 active:bg-[#121212]'>
						<ChevronRightIcon className='w-14 h-14' />
					</button>
				</span>
				<span className='py-2 w-full inline-flex flex-row justify-center items-center gap-10'>
					<button
						type='button'
						aria-label={muted ? 'Unmute' : 'Mute'}
						onClick={onToggleMute}
						className='bg-inherit outline-none border-none inline-flex justify-center items-center p-2 rounded-xl text-white transition duration-700 hover:bg-[#7A7A7A]/10 cursor-pointer'>
						{muted ? (
							<SpeakerXMarkIcon className='w-8 h-8' />
						) : (
							<SpeakerWaveIcon className='w-8 h-8' />
						)}
					</button>
					<button
						type='button'
						onClick={onTogglePlay}
						disabled={!isAdmin}
						title={
							isAdmin
								? undefined
								: 'Only the room admin can play or pause'
						}
						aria-label={paused ? 'Play' : 'Pause'}
						className={`${isAdmin ? 'cursor-pointer hover:bg-[#7A7A7A]/10' : 'opacity-40 cursor-not-allowed'} bg-inherit outline-none border-none inline-flex justify-center items-center lg:p-3 md:p-1 rounded-full text-white transition duration-700`}>
						{paused ? (
							<PlayIcon className='lg:w-14 lg:h-14 md:w-12 md:h-12' />
						) : (
							<PauseIcon className='lg:w-14 lg:h-14 md:w-12 md:h-12' />
						)}
					</button>
					<button
						type='button'
						aria-label='Like'
						onClick={() => setLiked(!liked)}
						className='bg-inherit outline-none border-none inline-flex justify-center items-center p-2 rounded-xl text-white transition duration-700 hover:bg-[#7A7A7A]/10 cursor-pointer'>
						{liked ? (
							<HeartIcon className='w-8 h-8' />
						) : (
							<OutlineHeartIcon className='w-8 h-8' />
						)}
					</button>
				</span>
				{currentTrack && (
					<>
						<span className='w-full px-12'>
							<span className='w-full inline-flex flex-row justify-between text-xs'>
								<p>{secToMin(dragTime ?? currentTime)}</p>
								<p>{secToMin(currentTrack.duration)}</p>
							</span>
							<input
								type='range'
								aria-label='Seek'
								min={0}
								max={currentTrack.duration}
								value={Math.floor(dragTime ?? currentTime)}
								disabled={!isAdmin}
								onChange={(event) =>
									setDragTime(Number(event.target.value))
								}
								onPointerUp={onCommitSeek}
								onKeyUp={onCommitSeek}
								className='appearance-none w-full h-1 rounded thumb bg-white disabled:opacity-60'
							/>
						</span>
						<span className='w-96 max-w-full px-12 my-2'>
							<h1 className='lg:w-full truncate oveflow-hidden font-bold text-center'>
								{currentTrack.title}
							</h1>
							<h5 className='lg:mt-2 lg:w-full truncate oveflow-hidden font-normal text-center'>
								{currentTrack.channel}
								{currentTrack.addedBy
									? ` · added by ${currentTrack.addedBy}`
									: ''}
							</h5>
						</span>
					</>
				)}
			</div>
			{!currentTrack && (
				<span className='h-full flex flex-col items-center justify-center opacity-50'>
					<h2 className='font-medium'>
						Search your Favourite songs and push it into the list.
						🔥
					</h2>
					<button
						className='w-fit my-4 p-4 flex gap-2 items-center justify-center appearance-none min-w-60 text-inherit text-lg text-white font-bold rounded-md transition duration-300 bg-[#434343] border-none border-[#343434] hover:cursor-pointer hover:bg-[#343434] active:shadow active:bg-[#222222]'
						onClick={() => dispatch(onOpenPanel())}>
						<MagnifyingGlassIcon className='w-6 h-6' />
						Search Songs
					</button>
				</span>
			)}
		</div>
	);
};

export default AudioPlayer;
