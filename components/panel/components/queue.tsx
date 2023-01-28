import React, { FC, MutableRefObject } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { selectSongsQueue } from 'redux/slice/roomSlice'
import DraggableList from 'components/room/queue/list'

const PanelDraggableQueue: FC<{audioElement ?: MutableRefObject<HTMLAudioElement|null>}> = ({audioElement}) => {

    const songs = useSelector(selectSongsQueue);
    const dispatch = useDispatch();

    return (
        <div className='w-1/3 h-full flex flex-col border-y-0 border-r-0 border-solid border-white border-l-[0.5px]'>
            <header className='sticky py-6 px-10 w-full h-20 inline-flex justify-between items-center border-t-0 border-x-0 border-solid border-white/10 bg-opacity-50 backdrop-blur backdrop-filter rounded-tr-xl z-20'>
                <h1 className='text-[20px]'>Songs Queue</h1>
            </header>
            {songs.length > 0 ? (
                <>
                    <DraggableList audioElement={audioElement} fromPanel={true} />
                </>
            ):(
                <>
                <div className='flex-1 min-w-full inline-flex justify-center items-center'>
                    <p className='text-sm text-white/30'>No Songs in Queue</p>
                </div>
                </>
            )}
        </div>
    )
}

export default PanelDraggableQueue