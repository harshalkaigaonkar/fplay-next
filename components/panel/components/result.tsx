import LoadingIcon from 'components/icon/loading';
import React, {useEffect, MutableRefObject} from 'react';
import { useSelector } from 'react-redux';
import { selectError, selectLoading, selectOverlayOpen, selectQuery, selectResults } from 'redux/slice/searchSlice';
import PanelSongResult from './cards/song';
import PanelAlbumResult from './cards/album';
import PanelArtistResult from './cards/artist';
import InfoOverlay from './overlay';

const PanelSearched: React.FC<{audioElement?: MutableRefObject<HTMLAudioElement|null>}> = ({audioElement}) => {

 const query = useSelector(selectQuery);
 const data = useSelector(selectResults);
 const loading = useSelector(selectLoading);
 const error = useSelector(selectError);
 const overlayOpen = useSelector(selectOverlayOpen);

 if(loading)
  return(
    <>
      <LoadingIcon className='w-10 h-10' />
    </>
  )

  if(error)
    return(
      <>
        <p className=''>No Results found for '{query}'</p>
      </>
    )

  if(overlayOpen)
      return(
        <>
        </>
      )

  return (
   <section className='overflow-y-auto'>
     {data.topQuery.results.length > 0 && (
      <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
          <h4 className='font-medium'>Top Results</h4>
          {/* <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
            <p className='cursor-pointer'>View More.</p>
          </button> */}
        </span>
        <span className='mt-4 w-full flex justify-between overflow-y-auto overflow-x-hidden'>
          {data.topQuery.results.map((item: any, index: number) => {
            switch(item.type) {
              case 'song':
                return (
                  <PanelSongResult data={item} key={index} audioElement={audioElement} />
                )
              case 'artist':
                return (
                  <PanelArtistResult data={item} key={index} audioElement={audioElement} />
                )
              case 'album':
                return (
                  <PanelAlbumResult data={item} key={index} audioElement={audioElement} />
                )
              default:
                return(<></>);
            }
          })}
        </span>
      </div>
     )}
     {data.songs.results.length > 0 && (
      <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
          <h4 className='font-medium'>Songs</h4>
          <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
            <p className='cursor-pointer text-[12px]'>View More.</p>
          </button>
        </span>
        <span className='mt-4 w-full flex justify-between overflow-y-auto overflow-x-hidden'>
          {data.songs.results.map((item: any, index: number) => (
            <PanelSongResult data={item} key={index} audioElement={audioElement} />
          ))}
        </span>
      </div>
     )}
     {
      data.albums.results.length > 0 && (
       <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
         <h4 className='font-medium'>Albums</h4>
         <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
          <p className='cursor-pointer text-[12px]'>View More.</p>
         </button>
        </span>
        <span className='mt-2 flex justify-between overflow-y-auto overflow-x-hidden'>
         {
          data.albums && data.albums.results.map((data: any, index: number) => (
           <>
             <PanelAlbumResult data={data} key={index} audioElement={audioElement} />
           </>
          ))}
        </span>
        </div>
      )
     }
     {
      data.artists.results.length > 0 && (
       <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
         <h4 className='font-medium'>Artists</h4>
         <button className='p-2 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
          <p className='cursor-pointer text-[12px]'>View More.</p>
         </button>
        </span>
       <span className='mt-2 flex justify-between overflow-y-auto overflow-x-hidden'>
       {data.artists.results.map((data: any, index: number) => (
        <>
          <PanelArtistResult data={data} key={index} audioElement={audioElement} />
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