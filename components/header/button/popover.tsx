import { Popover } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import ProfilePopover from 'components/popover/profile';
import Image from 'next/image';
import React from 'react';
import { UseSession } from 'types';

interface PopoverButtonProps {
	session: UseSession;
	onSignOut: () => Promise<void>;
}

const PopoverButton: React.FC<PopoverButtonProps> = ({
	session,
	onSignOut,
}) => {
	return (
		<Popover className='relative'>
			{({ open }) => (
				<>
					<Popover.Button
						className={`
              ${open ? '' : 'text-opacity-90'}
              group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-white hover:text-opacity-100 hover:bg-[#232323] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 bg-transparent border-none`}>
						<Image
							src={session && session.user.image}
							alt='Profile'
							height={30}
							width={30}
							className='rounded-full'
							loading='lazy'
						/>
						<ChevronDownIcon
							className={`${open ? '' : 'text-opacity-70 rotate-180'}
              ml-2 h-8 w-8 transition duration-700 ease-in-out group-hover:text-opacity-80`}
							aria-hidden='true'
						/>
					</Popover.Button>
					<ProfilePopover
						session={session}
						onSignOut={onSignOut}
					/>
				</>
			)}
		</Popover>
	);
};

export default PopoverButton;
