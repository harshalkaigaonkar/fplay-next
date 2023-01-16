import React from 'react'

const SongPlaying = () => {
  return (
    <div className='inline-flex flex-row items-end justify-center gap-1 h-[20px]'>
        <div className='w-[1px] h-2 bg-white rounded-full animate-height-grow-and-shrink-1'/>
        <div className='w-[1px] h-3 bg-white rounded-full animate-height-grow-and-shrink-2'/>
        <div className='w-[1px] h-4 bg-white rounded-full animate-height-grow-and-shrink-3'/>
        <div className='w-[1px] h-4 bg-white rounded-full animate-height-grow-and-shrink-4'/>
        <div className='w-[1px] h-4 bg-white rounded-full animate-height-grow-and-shrink-5'/>
    </div>
  )
}

export default SongPlaying