import { Transition } from '@headlessui/react';
import { ArrowLeftCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React, {Fragment} from 'react'
import { UseSession } from 'types';

interface ProfilePopoverProps {
 session: UseSession;
 onSignOut: () => Promise<void>;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({session, onSignOut}) => {
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
      
          <ul className='w-60 min-w-40 max-w- absolute z-10 top-12 list-none p-3 bg-[#343434] text-white text-lg rounded-md shadow-lg'>
          <li className="flex flex-row gap-4 items-center p-2 rounded-md hover:bg-[#212121] ">
            <div className="border">
              <Image 
                src={session.user.image} 
                alt="Profile" 
                width="40"
                height="40"
                className='rounded-full'
                />
            </div>
            <div className='flex flex-col justify-center'>
              <h4 className="m-0 p-0">Profile</h4>
              <span className="lg:text-[12px] font-normal md:text-[11px] sm:text-[10px]">{session && session?.user.name}</span>
            </div>
          </li>
          <li 
            className="flex flex-row gap-4 items-center p-2 rounded-md hover:bg-red-600"
            onClick={onSignOut}
            >
            <>
              <ArrowLeftCircleIcon
              className="w-6 h-6 m-2"
              />
            </>
            <>
              <h4>Log Out</h4>
            </>
          </li>
        </ul>
      </Transition>
  )
}

export default ProfilePopover