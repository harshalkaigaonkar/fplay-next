import { ChevronDownIcon } from '@heroicons/react/20/solid'
import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { onClosePanel, onOpenPanel, selectBottomSheet, selectCurrentSongId, selectSongsQueue } from 'redux/slice/roomSlice'
import { clearQuery, nullifyError } from 'redux/slice/searchSlice'
import { SaavnSongObjectTypes } from 'types'

const BottomSheet: FC<{children: JSX.Element}> = ({children}) => {
   
    const bottomSheet = useSelector(selectBottomSheet);
    const currentSongId = useSelector(selectCurrentSongId);
    const songsQueue = useSelector(selectSongsQueue);
    const dispatch = useDispatch();

    const [currentTrack, setCurrentTrack] = useState<SaavnSongObjectTypes>(songsQueue.find((item: SaavnSongObjectTypes) => item.id === currentSongId));


    const onPanelControl = () => {
        if(bottomSheet){
            dispatch(onClosePanel());
        }
        else
            dispatch(onOpenPanel());
    }
    return (
      <span className='animate-enter-opacity select-none'>
            {bottomSheet && <span onClick={onPanelControl} className="fixed inset-0 z-30" aria-hidden="true" />}
            <section className={` ${bottomSheet ? "h-[42rem] animate-enter-bottom": ""}
            fixed max-h-[42rem] min-h-[2rem] bottom-0 lg:left-20 lg:right-20 md:left-0 md:right-0 bg-black z-40 rounded-xl border-solid border-white`}>
                <span className='absolute -mt-10 -ml-10 appearance-none w-full inline-flex justify-end items-center cursor-pointer transition duration-300 z-30'>
                    <button className='h-fit bg-black text-white border-solid border-white focus:outline-none rounded-full inline-flex items-center' onClick={onPanelControl}>
                        <ChevronDownIcon
                            className={`${bottomSheet ? '' : 'rotate-180'}
                            p-2 rounded-full h-12 w-10 transition duration-700 ease-in-out group-hover:text-opacity-80`}
                            aria-hidden="true"
                        />
                    </button>
                </span>
                <>
                {bottomSheet ?
                    <span className='transition delay-300 animate-enter-opacity'>
                        {children}
                    </span> 
                    :
                    <span 
                     onClick={onPanelControl}
                     className='w-full transition delay-500 animate-enter-opacity inline-flex items-center py-2 px-4'>
                        <h4>Search Songs Here.</h4>
                    </span> 
                }
                </>
            </section>
      </span>
    )
  }

export default BottomSheet
