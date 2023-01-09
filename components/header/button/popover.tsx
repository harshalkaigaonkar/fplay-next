import { Popover } from '@headlessui/react'
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import ProfilePopover from 'components/popover/profile'
import React from 'react'
import { UseSession } from 'types'

interface PopoverButtonProps {
  session: UseSession;
  onSignOut: () => Promise<void>;
 }

const PopoverButton: React.FC<PopoverButtonProps> = ({session, onSignOut}) => {
  return (
   <Popover className='relative'>
   {({open}) => (
     <>
      <Popover.Button
           className={`
             ${open ? '' : 'text-opacity-90'}
             group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-white hover:text-opacity-100 hover:bg-[#232323] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 bg-transparent border-none`}
         >
         <UserCircleIcon
           className='w-8 h-8 text-white'
         />
         <ChevronDownIcon
           className={`${open ? '' : 'text-opacity-70'}
             ml-2 h-8 w-8 transition duration-150 ease-in-out group-hover:text-opacity-80`}
           aria-hidden="true"
         />                    
       </Popover.Button>
       <ProfilePopover session={session} onSignOut={onSignOut} />
     </>
   )}
 </Popover>
  )
}

export default PopoverButton