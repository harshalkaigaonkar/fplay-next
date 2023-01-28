import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { XCircleIcon } from '@heroicons/react/24/outline';
import e from 'cors';
import React, {useState} from 'react'

const PanelSearch = () => {

  const [searchActive, setSearchActive] = useState<boolean>(false);

  const openSearchHandler = () => {
	setSearchActive(true);
  }

  const closeSearchHandler = () => {
	setSearchActive(false);
  }

  return (
    <div className='w-2/3 h-full flex flex-col border-y-0 border-l-0 border-solid border-white border-r-[0.5px]'>
        <header className='sticky py-2 px-10 h-20 inline-flex justify-between items-center border-t-0 border-x-0 border-solid border-white/10 bg-opacity-50 backdrop-blur backdrop-filter rounded-tl-xl'>
            <h1 className='text-[20px] w-60'>Search Songs</h1>
			<form 
				onClick={openSearchHandler}
				className={` ${searchActive ? "w-full animate-enter-left-1 cursor-default ": "w-60 text-transparent cursor-pointer"}
				h-12 px-10 py-1 flex flex-row border-solid gap-5 border-gray-500 hover:border-gray-800 items-center rounded-full transition duration-300 text-inherit text-[13px] font-semibold bg-white`} 
			>
				{
					searchActive ? (
						<>
							<span>
								<MagnifyingGlassIcon className='w-6 h-6 text-black' />
							</span>
							<input 
								autoFocus
								type={"text"}
								className="py-1 px-3 appearance-none flex-1 text-black placeholder-black bg-inherit border-t-0 border-x-0 border-solid border-black focus:outline-none"
								placeholder="Search your songs here." 
								onClick={openSearchHandler}
							/>
							<span
								onClick={closeSearchHandler}
								className='inline-flex justify-center items-center rounded-full border border-transparent bg-gray-800 py-1 px-4 text-sm font-medium text-white hover:text-black hover:border-black shadow-lg hover:bg-white border-solid focus:outline-none cursor-pointer transition duration-150'
							>
									<XMarkIcon className='w-4 h-4 cursor-pointer' />
									<p className='ml-1 text-inherit cursor-pointer'>Cancel</p>
							</span>
						</>
					) : (
						<>
							<p className='w-full text-center font-bold text-black'>Search your songs here.</p>
						</>
					)
				}
			</form>
			{/* <div className={`w-60 h-fit p-3 flex border-solid border-white hover:border-gray-700 active:border-gray-800 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text transition duration-150 cursor-pointer`}>
				<p className={`w-full text-[13px] font-semibold text-transparent text-center cursor-pointer`}>Search your songs here.</p>
			</div> */}
        </header>
        <div className='flex-1 min-w-full inline-flex justify-center items-center'>
            <p className='text-xl text-white/30'>Search and Play Songs or Add To Queue ✨</p>
        </div>
    </div>
  )
}

export default PanelSearch