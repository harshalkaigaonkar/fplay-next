import DraggableList from 'components/room/queue/list'
import BottomSheet from 'components/sheet'
import React, { FC, MutableRefObject } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { selectSongsQueue } from 'redux/slice/roomSlice'

const MediaPanel: FC<{audioElement ?: MutableRefObject<HTMLAudioElement|null>}> = ({audioElement}) => {

  const songs = useSelector(selectSongsQueue);
  const dispatch = useDispatch();

  return (
    <>
        <BottomSheet>
            <section className='flex flex-row w-full h-full'>
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
              <div className='w-1/3 h-full flex flex-col border-solid border-t-0 border-r-0 border-solid border-white border-l-[0.5px]'>
                <header className='sticky py-2 px-10 w-full h-20 inline-flex justify-between items-center border-t-0 border-x-0 border-solid border-white/10 bg-opacity-50 backdrop-blur backdrop-filter rounded-tr-xl z-20'>
                  <h1 className='text-[20px]'>Songs Queue</h1>
                </header>
                {songs.length > 0 ? (
                  <>
                    <div className='flex-1 min-w-full'>
                      <DraggableList audioElement={audioElement} />
                    </div>
                  </>
                ):(
                  <>
                    <div className='flex-1 min-w-full inline-flex justify-center items-center'>
                      <p className='text-sm text-white/30'>No Songs in Queue</p>
                    </div>
                  </>
                )}
              </div>
            </section>
        </BottomSheet>
    </>
  )
}

export default MediaPanel