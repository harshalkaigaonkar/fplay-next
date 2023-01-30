import { EllipsisVerticalIcon, PlayIcon } from '@heroicons/react/20/solid';
import Image from 'next/image'
import React, {useState} from 'react'

const PanelSongResult: React.FC<{data: any, key: number}> = ({data, key}) => {

 const [mouseEnter, setMouseEnter] = useState<boolean>(false);

 const mouseEnterHandler = () => {
  setMouseEnter(true);
 }

 const mouseLeaveHandler = () => {
  setMouseEnter(false);
 }

  return (
    <div 
     key={key} 
     onMouseEnter={mouseEnterHandler} 
     onMouseLeave={mouseLeaveHandler} 
     className="w-64 h-16 m-2 bg-[#121212] hover:bg-[#343434] flex flex-row flex-wrap justify-start items-center rounded-lg overflow-hidden cursor-pointer transition duration-500"
    >
     <span className='ml-2'>
      <Image
       src={data.image || data.image[1].link || "https://www.jiosaavn.com/_i/3.0/artist-default-music.png"}
       alt={data.title + "_cover"}
       className={`${mouseEnter ? "rotate-0": "rotate-[20deg]"}
       rounded-full transition duration-300 cursor-pointer`}
       height={50}
       width={50}
       layout="fixed"
      />
      </span>
     <span className='ml-5 h-fit content-center overflow-hidden w-20'>
      <p className='text-sm font-bold cursor-pointer truncate'>{data.title || data.name}</p>
      <p className='mt-1 text-[10px] font-normal cursor-pointer truncate'>{data.description}{data.primaryArtists && `${data.primaryArtists}`}{data.featuringArtists && `ft. ${data.featuringArtists}`}</p>
     </span>
     {mouseEnter && (
      <div className='mx-[1px] flex-1 flex flex-row items-center justify-evenly animate-enter-div-1'>
        <span className='p-2 h-fit rounded-full bg-black inline-flex items-center cursor-pointer hover:bg-black/30 active:bg-black/60'>
          <PlayIcon className='w-5 h-5' />
        </span>
        <span className='p-2 h-fit rounded-full bg-black inline-flex items-center cursor-pointer hover:bg-black/30 active:bg-black/60'>
          <EllipsisVerticalIcon className='w-5 h-5' />
        </span>
      </div>
     )}
    </div>
  )
}

export default PanelSongResult