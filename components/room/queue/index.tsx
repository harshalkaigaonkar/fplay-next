import React from 'react'
import songs from 'songs.json';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/20/solid';
import DragIcon from 'components/icon/dragIcon';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { SaavnSongObjectTypes } from 'types';

const TrackQueue = () => {
  return (
    <div className='w-full h-full my-5 pt-2 flex flex-col bg-white/5 rounded-[40px]'>
        <header className='py-5 px-10 border-b-2 border-solid border-y-0 border-l-0 border-r-0 border-white/5 z-40'>
          <h2 className='w-full text-start'>Tracks Queue</h2>
        </header>
        <ul className='mt-1 px-3 h-[31.5rem] list-none flex flex-col justify-center gap-2 overflow-y-auto'>
          {
            songs.map((song: any) => (
              <li className='py-2 px-4 inline-flex flex-row items-center justify-around cursor-pointer rounded-md hover:bg-black hover:shadow-2xl' key={song.id}>
                <div className='w-3/4 inline-flex flex-row gap-5 items-center'>
                  <span className='relative inline-flex flex-col m-0 p-0 cursor-grab active:cursor-grabbing'>
                    <DragIcon className='w-5 h-5' />
                  </span> 
                  <span>
                    <Image
                      src={song.image[1].link}
                      alt={`Song Icon ${song.image[1].quality}`}
                      width={45}
                      height={45}
                      className="rounded-md"
                    />
                  </span>
                  <span className='inline-flex flex-col gap-2'>
                    <h5 className='w-full font-semibold'>{song.name}</h5>
                    <h6 className='font-normal'>{song.primaryArtists}{song.featuredArtists && ` ft. ${song.featuredArtists}`}</h6>
                  </span>
                </div>
                <div className='flex-0' />
                <div className='w-1/4 inline-flex flex-row justify-end gap-4'>
                  <span>
                    <TrashIcon className='w-6 h-6' />
                  </span>
                  <span>
                    <HeartIcon className='w-6 h-6' />
                  </span>
                  <span>
                    <EllipsisVerticalIcon className='w-6 h-6' />
                  </span>
                </div>
              </li>
            ))
            }
        </ul>
    </div>
  )
}

export default TrackQueue