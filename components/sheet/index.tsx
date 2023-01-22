import { ChevronDownIcon } from '@heroicons/react/20/solid'
import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { onClosePanel, onOpenPanel, selectBottomSheet } from 'redux/slice/roomSlice'

const BottomSheet: FC<{children: JSX.Element}> = ({children}) => {
   
    const bottomSheet = useSelector(selectBottomSheet);
    const dispatch = useDispatch();

    const onPanelControl = () => {
        if(bottomSheet)
            dispatch(onClosePanel());
        else
            dispatch(onOpenPanel());
    }
    return (
      <span className='animate-enter-opacity select-none'>
            {bottomSheet && <span onClick={onPanelControl} className="fixed inset-0 z-30" />}
            <section className={` ${bottomSheet ? "h-[90%] animate-enter-bottom": ""}
            fixed max-h-[90%] min-h-[5%] bottom-0 left-20 right-20 bg-black z-40 rounded-xl border-solid border-white`}>
                <span className='-mt-20 w-full inline-flex justify-end cursor-pointer' onClick={onPanelControl}>
                    <ChevronDownIcon
                        className={`${bottomSheet ? '' : 'text-opacity-70 rotate-180'}
                        p-2 mr-10 rounded-full h-12 w-12 transition duration-700 ease-in-out bg-black border-solid border-white group-hover:text-opacity-80`}
                        aria-hidden="true"
                    />
                </span>
                <>
                {bottomSheet && 
                    <span className='transition delay-300 animate-enter-opacity'>
                        {children}
                    </span>
                }
                </>
            </section>
      </span>
    )
  }

export default BottomSheet
