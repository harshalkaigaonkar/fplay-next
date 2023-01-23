import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import AddToPlaylistIcon from 'components/icon/addToPlaylist';
import { secToMin } from 'helpers';
import Image from 'next/image';
import React, { FC, MutableRefObject, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { onChangeClickedSongFromQueue, onChangeNextSongFromQueue, onChangePrevSongFromQueue, onSetPause, onSetPlay, onUpdateTime, selectCurrentSongId, selectPaused, selectTime } from 'redux/slice/roomSlice';
import { SaavnSongObjectTypes } from 'types';

const AudioPlayer : FC<AudioPlayerProps>  = ({currentTrack, audioElement}) => {

    const paused = useSelector(selectPaused);
    const currentTime = useSelector(selectTime);


    const dispatch = useDispatch()
    
    const [liked, setLiked] = useState<boolean|null>(false) //to redux later

    const onPlayHandler = () => {
        audioElement.current.play();
    }
    
    const onPauseHandler = () => {
        audioElement.current.pause();
    }

    const onLikeHandler = () => {
        setLiked(!liked);
    }

    const onPrevTrack = () => {
        if(currentTime <= 5)
            dispatch(onChangePrevSongFromQueue());
        else {
            audioElement.current.load();
            audioElement.current.play();
        }
    }

    const onNextTrack = () => {
        dispatch(onChangeNextSongFromQueue());
    }

    const updateTimeHandler = (event: any) => {
        audioElement.current.currentTime = event.target.value;
    }
    
  
    return (
        <div className='h-[38.5rem] mt-5 px-5 py-10 flex flex-col items-center gap-2 bg-gradient-to-br from-black to-[#7A7A7A] rounded-[40px]'>
            {currentTrack && (
                <>
                    <span className='w-full inline-flex flex-row items-center justify-evenly'>
                        <span onClick={onPrevTrack} className='p-2 inline-flex items-center h-fit text-white/70 rounded-full hover:-translate-x-1 hover:bg-white/5 cursor-pointer transition duration-500 active:bg-[#121212]'>
                            <ChevronLeftIcon className='w-20 h-20' />
                        </span>
                        <div className='flex-0 flex flex-row justify-center items-center gap-10 border-1 border-white/50 border-solid rounded-2xl shadow-2xl overflow-hidden group-hover:scale-105'>
                            <Image
                                src={currentTrack.image[2].link}
                                alt="track_banner"
                                height={250}
                                width={250}
                                priority
                                objectFit='cover'
                                className="object-cover rounded-2xl hover:scale-105 transition duration-700"
                            />
                        </div>
                        <span onClick={onNextTrack} className='p-2 inline-flex items-center h-fit text-white/70 rounded-full hover:translate-x-1 hover:bg-white/5 cursor-pointer transition duration-500 active:bg-[#121212]'>
                            <ChevronRightIcon className='w-20 h-20' />
                        </span>
                    </span>
                    <span className='py-2 w-full inline-flex flex-row justify-center items-center gap-10'>
                        <span className='bg-inherit outline-none border-none inline-flex justify-center items-center p-2 rounded-xl text-white transition duration-700 hover:shadow-2xl hover:shadow-black hover:bg-[#7A7A7A]/10 cursor-pointer'>
                            <AddToPlaylistIcon className='lg:w-10 lg:h-10 md:w-8 md:w-8' />
                        </span>
                        <button
                            onClick={paused || (audioElement.current && audioElement.current.paused) ? onPlayHandler : onPauseHandler}
                            className='bg-inherit outline-none border-none inline-flex justify-center items-center lg:p-4 md:p-1 sm:p-1 rounded-full text-white transition duration-700 hover:shadow-2xl hover:shadow-black hover:bg-[#7A7A7A]/10 cursor-pointer'
                        >
                            {paused || (audioElement.current && audioElement.current.paused) ? 
                            <PlayIcon className='lg:w-16 lg:h-16 md:w-14 md:h-14' /> :
                            <PauseIcon className='lg:w-16 lg:h-16 md:w-14 md:h-14' />}
                        </button>
                        <span
                            onClick={onLikeHandler} 
                            className='bg-inherit outline-none border-none inline-flex justify-center items-center p-2 rounded-xl text-white transition duration-700 hover:shadow-2xl hover:shadow-black hover:bg-[#7A7A7A]/10 cursor-pointer'
                        >
                            {liked ? 
                            <HeartIcon className='lg:w-10 lg:h-10 md:w-8 md:w-8' /> :
                            <OutlineHeartIcon className='lg:w-10 lg:h-10 md:w-8 md:w-8' /> }
                        </span>
                    </span>
                    <span className='w-full px-12'>
                        <span className='w-full inline-flex flex-row justify-between text-xs'>
                            <p>{secToMin(currentTime)}</p>
                            <p>{secToMin(currentTrack.duration)}</p>
                        </span>
                        <input 
                            type="range" 
                            min={0} 
                            max={currentTrack.duration} 
                            value={currentTime} 
                            onChange={updateTimeHandler}
                            className='appearance-none w-full h-1 rounded thumb bg-white' 
                        />
                    </span>
                    <span className='w-full px-12 my-2'>
                        <h1 className='lg:w-full truncate oveflow-hidden font-bold text-center'>{currentTrack.name}</h1>
                        <h5 className='lg:mt-2 lg:w-full truncate oveflow-hidden font-normal text-center'>{currentTrack.primaryArtists}{currentTrack.featuredArtists && ` ft. ${currentTrack.featuredArtists}`}</h5>
                    </span>
                </>
            )}
        </div>
    );
}

export default AudioPlayer