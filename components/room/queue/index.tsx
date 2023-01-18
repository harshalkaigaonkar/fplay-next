import React from 'react'
import DraggableList from './list';

const TrackQueue = () => {

  return (
    <div className='w-full h-full mt-5 pt-0 flex flex-col bg-white/5 overflow-hidden rounded-[40px]'>
        <section className='sticky mt-0 py-6 px-10 border-b-2 border-solid border-y-0 border-l-0 border-r-0 border-white/5 bg-opacity-50 backdrop-blur backdrop-filter z-20'>
          <h2 className='w-full text-start'>Tracks Queue</h2>
        </section>
        <DraggableList />
    </div>
  )
}

export default TrackQueue