import React from 'react'

const PanelSearch = () => {
  return (
    <div className='w-2/3 h-full flex flex-col border-t-0 border-l-0 border-solid border-white border-r-[0.5px]'>
        <header className='sticky py-2 px-10 h-20 inline-flex justify-between items-center border-t-0 border-x-0 border-solid border-white/10 bg-opacity-50 backdrop-blur backdrop-filter rounded-tl-xl'>
            <h1 className='text-[20px]'>Search Songs</h1>
            <div className='w-60 h-fit p-3 flex border-solid border-white hover:border-gray-700 active:border-gray-800 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text transition duration-150 cursor-pointer'>
                <p className='w-full  text-[13px] font-semibold text-transparent text-center cursor-pointer'>Search your songs here.</p>
            </div>
        </header>
        <div className='flex-1 min-w-full inline-flex justify-center items-center'>
            <p className='text-xl text-white/30'>Search and Play Songs or Add To Queue ✨</p>
        </div>
    </div>
  )
}

export default PanelSearch