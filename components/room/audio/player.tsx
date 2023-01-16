import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';
// import HeartOulineIcon from 'components/icon/heartOutline';
import Image from 'next/image';
import React from 'react'

const AudioPlayer = () => {  
  
    return (
        <div className='h-auto my-5 px-5 py-10 flex flex-col items-center gap-2 bg-gradient-to-br from-black to-[#7A7A7A] rounded-[40px]'>
            <span className='w-full inline-flex flex-row items-center justify-evenly'>
                <ChevronLeftIcon className='m-2 p-1 w-20 text-white/70 rounded-full hover:-translate-x-1 hover:bg-white/5 transition duration-500 active:bg-[#121212] hover:cursor-pointer' />
                    <div className='flex-0 flex flex-row justify-center items-center gap-10 border-1 border-white/50 border-solid drop-shadow-2xl rounded-2xl'>
                        <Image
                            src="https://c.saavncdn.com/662/Chalo-Chalein-Hindi-2021-20210208203817-500x500.jpg"
                            alt="next_track_banner"
                            height={250}
                            width={250}
                            className="rounded-2xl"
                        />
                    </div>
                <ChevronRightIcon className='m-2 p-1 w-20 text-white/70 rounded-full hover:translate-x-1 hover:bg-white/5 transition duration-500 active:bg-[#121212] hover:cursor-pointer' />
            </span>
            <span className='py-4 w-full inline-flex flex-row justify-center items-center gap-6'>
                <ArrowUpIcon className='m-3 p-2 w-12 h-12 rounded-xl bg-[#7A7A7A] text-white shadow-2xl shadow-black hover:cursor-pointer' />
                <PlayIcon className='py-3 pl-1.5 w-20 h-20 rounded-full bg-[#7A7A7A] text-white shadow-2xl shadow-black hover:cursor-pointer' />
                {/* <PauseIcon className='m-3 p-3 w-20 h-20 rounded-full bg-[#7A7A7A] text-white shadow-2xl shadow-black hover:cursor-pointer' /> */}
                <HeartIcon className='m-3 p-2 w-12 h-12 rounded-xl bg-[#7A7A7A] text-white shadow-2xl shadow-black hover:cursor-pointer' />
                {/* <OutlineHeartIcon className='m-3 p-2 w-12 h-12 rounded-xl bg-[#7A7A7A] text-white shadow-2xl shadow-black hover:cursor-pointer' /> */}
            </span>
            <span className='w-full px-12'>
                <span className='w-full inline-flex flex-row justify-between text-xs'>
                    <p>0:00</p>
                    <p>4:09</p>
                </span>
                <input type="range" className='appearance-none w-full h-1 rounded thumb bg-white' />
            </span>
            <span className='w-full px-12 my-5 text-center'>
                <h1 className='w-96 truncate oveflow-hidden font-bold'>Chalo Chalein</h1>
                <h5 className='w-96 truncate oveflow-hidden font-normal'>Ritviz ft. Seedhe Maut</h5>
            </span>
        </div>
    );
}

export default AudioPlayer