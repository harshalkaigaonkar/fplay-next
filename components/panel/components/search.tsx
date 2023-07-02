import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { XCircleIcon } from '@heroicons/react/24/outline';
import LoadingIcon from 'components/icon/loading';
import { fetchAllThroughSearchQuery } from 'helpers/music/fetchAll';
import React, {useState, useRef, FC, MutableRefObject} from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { changeSearchQuery, onActiveSearch, onUnactiveSearch, selectQuery, selectResults, selectSearchActive, setError, startLoading, updateSearchResults } from 'redux/slice/searchSlice';
import { resourceLimits } from 'worker_threads';
import PanelSearched from './result';

const PanelSearch: FC<{audioElement: MutableRefObject<HTMLAudioElement|null>}> = ({audioElement}) => {

		const query = useSelector(selectQuery);
		const results = useSelector(selectResults);
		const searchActive = useSelector(selectSearchActive);
		const dispatch = useDispatch();

		const timeout = useRef<ReturnType<typeof setTimeout>|null>(null);

		const inputElement = useRef<HTMLInputElement|null>(null);

  const openSearchHandler = () => {
			dispatch(onActiveSearch());
  }

  const closeSearchHandler = () => {
			dispatch(changeSearchQuery(""));
			dispatch(onUnactiveSearch());
  }

		const queryChangeHandler  = async () => {
			if(inputElement.current) {
				const searchQuery = inputElement.current.value;
				dispatch(changeSearchQuery(searchQuery))
				dispatch(startLoading());
				/**
					* This can be optimized for no rate limit exceeding
					* Debouce Function
					* Update: Working till some extent, the query should be specific to some relevant info, otherwise shows loading forever.
				 */

					if (timeout.current != null) {
							clearTimeout(timeout.current); 
							timeout.current = null;
					}
					timeout.current = setTimeout(async () => {
						const res = await fetchAllThroughSearchQuery(searchQuery);
						if(typeof res !== 'string') 
							dispatch(updateSearchResults(res));
							else
							dispatch(setError(`No Result found for '${query}'`))
					}, 1000);
			}
		}

  return (
    <div className='w-2/3 h-full flex flex-col border-y-0 border-l-0 border-solid border-white border-r-[0.5px]'>
        <header className='rlative py-2 px-10 h-20 inline-flex justify-between items-center border-t-0 border-x-0 border-solid border-white/10 bg-opacity-50 backdrop-blur backdrop-filter rounded-tl-xl'>
            <h1 className='font-bold text-[20px] w-60'>Search Songs</h1>
			<section
				className={` ${searchActive ? "w-full animate-enter-left-1 cursor-default ": "w-60 text-transparent cursor-pointer"}
				h-12 flex flex-row justify-center border-solid gap-2 border-[#808080] hover:border-gray-800 items-center rounded-full transition duration-700 text-inherit text-[13px] font-semibold bg-black active:opacity-25`} 
			>
				{
					searchActive ? (
						<>
							<span className='ml-10'>
								<MagnifyingGlassIcon className='w-6 h-6' />
							</span>
							<input 
								id="search_query"
								autoFocus
								ref={inputElement}
								type="text"
								value={query}
								onChange={queryChangeHandler}
								className="py-1 px-3 appearance-none flex-1 bg-inherit placeholder-white text-white border-t-0 border-x-0 border-solid border-white focus:outline-none"
								placeholder="Search your songs here..."
							/>
							<span
								onClick={closeSearchHandler}
								className='mr-2 inline-flex justify-center items-center rounded-full border border-transparent bg-black/40 py-1 px-4 text-sm font-medium text-white hover:text-black hover:border-black shadow-lg hover:bg-white border-solid focus:outline-none cursor-pointer transition duration-150'
							>
									<XMarkIcon className='w-4 h-4 cursor-pointer' />
									<p className='ml-1 text-inherit cursor-pointer'>Cancel</p>
							</span>
						</>
					) : (
						<span className='inline-flex justify-center items-center w-full h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 bg-clip-text' onClick={openSearchHandler}>
							<p className='w-full text-md text-center  text-white cursor-pointer'>Look for your songs here.</p>
						</span>
					)
				}
			</section>
			{/* <div className={`w-60 h-fit p-3 flex border-solid border-white hover:border-gray-700 active:border-gray-800 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text transition duration-150 cursor-pointer`}>
				<p className={`w-full text-[13px] font-semibold text-transparent text-center cursor-pointer`}>Search your songs here.</p>
			</div> */}
        </header>
            {
													query.length ? (
															<div className='px-5'>
																<PanelSearched audioElement={audioElement} />
															</div>
													):(
														<div className='flex-1 min-w-full inline-flex justify-center items-center overflow-y-auto'>
															<p className='font-semibold text-xl text-white/30'>Search and Play Songs or Add To Queue ✨</p>
       						 </div>
													)
												}
    </div>
  )
}

export default PanelSearch