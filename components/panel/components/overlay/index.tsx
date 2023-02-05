import { Transition } from '@headlessui/react'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import React, { FC, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectQuery } from 'redux/slice/searchSlice'

type InfoOverlayProps = {
  children?: ReactNode,
  backHandler: () => void,
  error?: string|null,
  overlayType?: "options|song"|"options|album"|"options|artist"|"album"|"artist"|null|undefined|null
}

const InfoOverlay: FC<InfoOverlayProps> = ({children, backHandler, error, overlayType}) => {

  const query = useSelector(selectQuery);

  return (
      <section className='w-full flex flex-col lg:h-[36rem]'>
        <div className='sticky bg-opacity-50 backdrop-blur backdrop-filter flex flex-row justify-start items-center gap-6 border-solid border-t-0 border-x-0 border-[#7a7a7a] z-10'>
          <button
           onClick={backHandler}
           className='ml-3 p-2 bg-inherit border-none rounded-t-full cursor-pointer transition duration-200 hover:-translate-x-1'>
            <ArrowLeftIcon className='w-6 h-6 text-white inline-block align-middle' />
          </button>
          <div>
            {overlayType === 'artist' ? (
              <>
              <p className="font-normal text-md">Artist</p>
              </>
            ) : 
            overlayType === 'album' ? (
              <>
              <p className="font-normal text-md">Album</p>
              </>
            ) :
            overlayType?.includes("options") ? (
              <>
                <p className="font-normal text-md">showing {overlayType?.split("|")[1]} results for "{query}"</p>
              </>
            ) : (
              <>
                <p className="font-normal text-md">Error Occured</p>
              </>
            )}
          </div>
        </div>
        {
          children ? (
            <>
              {children}
            </>
          ) : (
            <>
              <h4>{error}</h4>
            </>
          )
        }
      </section>
  )
}

export default InfoOverlay