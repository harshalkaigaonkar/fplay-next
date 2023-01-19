import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
import AddToPlaylistIcon from 'components/icon/addToPlaylist';
import { secToMin } from 'helpers';
// import HeartOulineIcon from 'components/icon/heartOutline';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react'

const AudioPlayer : FC<{currentTrack: any, audioElement: HTMLAudioElement|any, currentTime: number, paused: boolean|undefined, setPaused: any}> = ({currentTrack, audioElement, currentTime, paused, setPaused}) => {

    useEffect(() => {
        if(audioElement.current.paused) 
            setPaused(true)
        else
            setPaused(false)
            console.log(currentTime)
    }, [audioElement.current])
    

    const [liked, setLiked] = useState<boolean|null>(false)

    const onPlayHandler = () => {
        audioElement.current.play();
        setPaused(false);
    }
    
    const onPauseHandler = () => {
        audioElement.current.pause()
        setPaused(true);
    }

    const onLikeHandler = () => {
        setLiked(!liked);
    }
  
    return (
        <div className='h-[38.5rem] my-5 px-5 py-10 flex flex-col items-center gap-2 bg-gradient-to-br from-black to-[#7A7A7A] rounded-[40px]'>
            {currentTrack && (
                <>
                    <span className='w-full inline-flex flex-row items-center justify-evenly'>
                <ChevronLeftIcon className='m-2 p-1 w-20 text-white/70 rounded-full hover:-translate-x-1 hover:bg-white/5 transition duration-500 active:bg-[#121212] hover:cursor-pointer' />
                    <div className='flex-0 flex flex-row justify-center items-center gap-10 border-1 border-white/50 border-solid drop-shadow-2xl rounded-2xl'>
                        <Image
                            src={currentTrack.image[2].link}
                            alt="track_banner"
                            height={250}
                            width={250}
                            priority
                            className="rounded-2xl"
                        />
                    </div>
                <ChevronRightIcon className='m-2 p-1 w-20 text-white/70 rounded-full hover:translate-x-1 hover:bg-white/5 transition duration-500 active:bg-[#121212] hover:cursor-pointer' />
            </span>
            <span className='py-4 w-full inline-flex flex-row justify-center items-center gap-10'>
                <span className='inline-flex justify-center items-center p-2 rounded-xl text-white transition duration-700 hover:shadow-2xl hover:shadow-black hover:bg-[#7A7A7A]/10 cursor-pointer'>
                    <AddToPlaylistIcon className='lg:w-10 lg:h-10 md:w-8 md:w-8' />
                </span>
                <span
                    onClick={paused ? onPlayHandler : onPauseHandler}
                    className='inline-flex justify-center items-center p-4 rounded-full text-white transition duration-700 hover:shadow-2xl hover:shadow-black hover:bg-[#7A7A7A]/10 cursor-pointer'
                >
                    {paused ? 
                    <PlayIcon className='lg:w-16 lg:h-16 md:w-14 md:h-14' /> :
                    <PauseIcon className='lg:w-16 lg:h-16 md:w-14 md:h-14' />}
                </span>
                <span
                    onClick={onLikeHandler} 
                    className='inline-flex justify-center items-center p-2 rounded-xl text-white transition duration-700 hover:shadow-2xl hover:shadow-black hover:bg-[#7A7A7A]/10 cursor-pointer'
                >
                    {liked ? 
                    <HeartIcon className='lg:w-10 lg:h-10 md:w-8 md:w-8' /> :
                    <OutlineHeartIcon className='lg:w-10 lg:h-10 md:w-8 md:w-8' /> }
                </span>
            </span>
            <span className='w-full px-12'>
                <span className='w-full inline-flex flex-row justify-between text-xs'>
                    <p>{secToMin(currentTime)}</p>
                    <p>{secToMin(audioElement.current?.duration ? audioElement.current.duration : currentTrack.duration)}</p>
                </span>
                <input 
                    type="range" 
                    min={0} 
                    max={currentTrack.duration} 
                    value={currentTime} 
                    className='appearance-none w-full h-1 rounded thumb bg-white' 
                />
            </span>
            <span className='w-full px-12 my-5'>
                <h1 className='lg:w-full truncate oveflow-hidden font-bold text-center'>{currentTrack.name}</h1>
                <h5 className='lg:mt-2 lg:w-full truncate oveflow-hidden font-normal text-center'>{currentTrack.primaryArtists}{currentTrack.featuredArtists && ` ft. ${currentTrack.featuredArtists}`}</h5>
            </span>
                </>
            )}
        </div>
    );
}

export default AudioPlayer