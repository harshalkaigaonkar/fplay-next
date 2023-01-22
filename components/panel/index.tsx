import BottomSheet from 'components/sheet'
import React from 'react'

const MediaPanel = () => {
  return (
    <>
        <BottomSheet>
            <section className='flex flex-col w-full h-full'>
              <header className='sticky py-2 px-10 w-full inline-flex justify-between items-center border-t-0 border-x-0 border-solid border-white/10'>
                <h1 className='text-[20px]'>Search Songs</h1>
                <div className='w-60 h-full p-3 flex border-solid border-white hover:border-gray-700 active:border-gray-800 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text transition duration-150 cursor-pointer'>
                  <p className='w-full  text-[13px] font-semibold text-transparent text-center cursor-pointer'>Search your songs here.</p>
                </div>
              </header>
              <div className='flex-1 min-w-full inline-flex justify-center items-center'>
                <p className='text-xl text-white/30'>Search and Play Songs or Add To Queue ✨</p>
              </div>
            </section>
        </BottomSheet>
    </>
  )
}

export default MediaPanel