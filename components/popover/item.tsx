import { Transition } from '@headlessui/react';
import { ArrowLeftCircleIcon, BookmarkIcon, MusicalNoteIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React, {Fragment} from 'react'
import { UseSession } from 'types';

interface ItemOptionsProps {
 deleteHandler: () => void;
}

const ItemOptions: React.FC<ItemOptionsProps> = ({deleteHandler}) => {
  return (
    <Transition
     as={Fragment}
     enter="transition ease-out duration-200"
     enterFrom="opacity-0 translate-y-1"
     enterTo="opacity-100 translate-y-0"
     leave="transition ease-in duration-150"
     leaveFrom="opacity-100 translate-y-0"
     leaveTo="opacity-0 translate-y-1"
     >
      <ul className='absolute right-0 w-40 min-w-20 max-w-40 list-none px-0 bg-black text-white text-lg rounded-md shadow-lg'>
        {/* <header className='my-1 px-5 py-3 border-b-1 border-t-0 border-l-0 border-r-0 border-solid border-[#7a7a7a]'>
          <h5 
            className='h-fit min-w-full overflow-hidden truncate'>
            {session && session.user.name}
          </h5>
          <h6 
            className='h-fit p-0 m-0 max-w-full overflow-hidden text-ellipsis font-normal'>
            {session && session.user.email}
          </h6>
        </header> */}
        <li
          onClick={deleteHandler}
          className="m-1 flex flex-row gap-4 items-center p-2 rounded-md hover:bg-[#212121]">
          <>
            <TrashIcon
              className='w-4 h-4 m-2 text-red-600'
            />
          </>
          <>
            <h6>Remove</h6>
          </>
        </li>
        {/* <li
          className="m-2 flex flex-row gap-4 items-center p-2 rounded-md hover:bg-[#212121] ">
          <>
            <MusicalNoteIcon
              className='w-6 h-6 m-2'
            />
          </>
          <>
            <h4>Library</h4>
          </>
        </li>
        <li 
          className="m-2 flex flex-row gap-4 items-center p-2 rounded-md hover:bg-red-600"
          onClick={onSignOut}>
          <>
            <ArrowLeftCircleIcon
            className="w-6 h-6 m-2"
            />
          </>
          <>
            <h4>Log Out</h4>
          </>
        </li> */}
      </ul>
    </Transition>
  )
}

export default ItemOptions