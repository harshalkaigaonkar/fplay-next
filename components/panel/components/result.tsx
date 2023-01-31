import LoadingIcon from 'components/icon/loading';
import React, {useEffect, MutableRefObject} from 'react';
import { useSelector } from 'react-redux';
import { selectError, selectLoading, selectQuery, selectResults } from 'redux/slice/searchSlice';
import PanelSongResult from './cards/index';

const PanelSearched: React.FC<{audioElement?: MutableRefObject<HTMLAudioElement|null>}> = ({audioElement}) => {

 const query = useSelector(selectQuery);
 const data = useSelector(selectResults);
 const loading = useSelector(selectLoading);
 const error = useSelector(selectError);

 if(loading)
  return(
    <>
      <LoadingIcon />
    </>
  )

  if(error)
    return(
      <>
        <p className=''>No Results found for '{query}'</p>
      </>
    )

  return (
   <section className='overflow-y-auto'>
     {data.topquery.data.length > 0 && (
      <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
          <h4 className='font-medium'>Top Results</h4>
          {/* <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
            <p className='cursor-pointer'>View More.</p>
          </button> */}
        </span>
        <span className='mt-4 w-full flex justify-between overflow-y-auto overflow-x-hidden'>
          {data.topquery.data.map((item: any, index: number) => (
            <PanelSongResult data={item} key={index} audioElement={audioElement} />
          ))}
        </span>
      </div>
     )}
     {data.songs.data.length > 0 && (
      <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
          <h4 className='font-medium'>Songs</h4>
          <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
            <p className='cursor-pointer text-[12px]'>View More.</p>
          </button>
        </span>
        <span className='mt-4 w-full flex justify-between overflow-y-auto overflow-x-hidden'>
          {data.songs.data.map((item: any, index: number) => (
            <PanelSongResult data={item} key={index} audioElement={audioElement} />
          ))}
        </span>
      </div>
     )}
     {
      data.albums.data.length > 0 && (
       <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
         <h4 className='font-medium'>Albums</h4>
         <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
          <p className='cursor-pointer text-[12px]'>View More.</p>
         </button>
        </span>
        <span className='mt-2 flex justify-between overflow-y-auto overflow-x-hidden'>
         {
          data.albums && data.albums.data.map((data: any, index: number) => (
           <>
             <PanelSongResult data={data} key={index} audioElement={audioElement} />
           </>
          ))}
        </span>
        </div>
      )
     }
     {
      data.artists.data.length > 0 && (
       <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
         <h4 className='font-medium'>Artists</h4>
         <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
          <p className='cursor-pointer text-[12px]'>View More.</p>
         </button>
        </span>
       <span className='mt-2 flex justify-between overflow-y-auto overflow-x-hidden'>
       {data.artists.data.map((data: any, index: number) => (
        <>
          <PanelSongResult data={data} key={index} audioElement={audioElement} />
        </>
       ))}
       </span>
       </div>
      )
     }
   </section>
 )
}

export default PanelSearched