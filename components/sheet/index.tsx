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
                <span className='-mt-20 -ml-10 appearance-none w-full inline-flex justify-end items-center cursor-pointer transition duration-300'>
                    <button className='h-fit bg-black text-white border-solid border-white focus:outline-none rounded-full inline-flex items-center' onClick={onPanelControl}>
                        <ChevronDownIcon
                            className={`${bottomSheet ? '' : 'rotate-180'}
                            p-2 rounded-full h-12 w-10 transition duration-700 ease-in-out group-hover:text-opacity-80`}
                            aria-hidden="true"
                        />
                    </button>
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
