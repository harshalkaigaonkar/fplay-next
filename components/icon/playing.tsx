import React, { FC } from 'react'

const SongPlaying: FC<{type: 3|5}> = ({type}) => {
  if(type === 3)
  return (
    <div className='inline-flex flex-row items-end justify-center gap-1 h-[20px]'>
      <span className='w-[5px] h-2 bg-white rounded-[1px] animate-height-grow-and-shrink-1' />
      <span className='w-[5px] h-2 bg-white rounded-[1px] animate-height-grow-and-shrink-4' />
      <span className='w-[5px] h-2 bg-white rounded-[1px] animate-height-grow-and-shrink-2' />
    </div>
  )
  else
  return (
    <div className='inline-flex flex-row items-end justify-center gap-1 h-[20px]'>
        <span className='w-[1px] h-2 bg-white rounded-full animate-height-grow-and-shrink-1'/>
        <span className='w-[1px] h-3 bg-white rounded-full animate-height-grow-and-shrink-2'/>
        <span className='w-[1px] h-4 bg-white rounded-full animate-height-grow-and-shrink-3'/>
        <span className='w-[1px] h-4 bg-white rounded-full animate-height-grow-and-shrink-4'/>
        <span className='w-[1px] h-4 bg-white rounded-full animate-height-grow-and-shrink-5'/>
    </div>
  )
}

export default SongPlaying