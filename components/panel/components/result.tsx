import LoadingIcon from 'components/icon/loading';
import React, {useEffect, useState, MutableRefObject} from 'react';
import { useSelector } from 'react-redux';
import { nullifyError, onActiveSearch, onUnactiveSearch, selectError, selectLoading, selectOverlayOpen, selectQuery, selectResults, setError, startLoading, updateSearchResults } from 'redux/slice/searchSlice';
import PanelSongResult from './cards/song';
import PanelAlbumResult from './cards/album';
import PanelArtistResult from './cards/artist';
import InfoOverlay from './overlay';
import ArtistOverlay from './overlay/artist';
import AlbumOverlay from './overlay/album';
import MoreOptions from './overlay/options';
import { useDispatch } from 'react-redux';
import { fetchSongsThroughSearchQuery } from 'helpers/music/fetchSongs';
import { SaavnAlbumObjectTypes, SaavnArtistObjectTypes, SaavnSongObjectTypes } from 'types';
import { fetchAlbumsThroughSearchQuery } from 'helpers/music/fetchAlbums';
import { fetchArtistsThroughSearchQuery } from 'helpers/music/fetchArtists';

const PanelSearched: React.FC<{audioElement?: MutableRefObject<HTMLAudioElement|null>}> = ({audioElement}) => {

 const query = useSelector(selectQuery);
 const data = useSelector(selectResults);
 const loading = useSelector(selectLoading);
 const error = useSelector(selectError);

 const dispatch = useDispatch()

 const [overlayType, setOverlayType] = useState<"options|song"|"options|album"|"options|artist"|"album"|"artist"|null|undefined>(null);
 const [fetchingError, setFetchingError] = useState<string|null|undefined>(null);
 const [overlayResults, setOverlayResults] = useState<
  // SaavnSongObjectTypes[]|SaavnArtistObjectTypes[]|SaavnAlbumObjectTypes[]|null
  any
  >(null);

 const overlayBackHandler = () => {
  dispatch(onActiveSearch());
  setOverlayType(null);
 }

 const onViewMoreSongs = async () => {
  dispatch(onUnactiveSearch());
  dispatch(startLoading());
  const res = await fetchSongsThroughSearchQuery(query);
  if(res !== "Failed") {
    setOverlayResults(res.results);
    setOverlayType('options|song');
    dispatch(nullifyError());
  }
  else {
    setOverlayType(null);
    setFetchingError(`No Songs found for '${query}'`);
  }
 }
 const onViewMoreAlbums = async () => {
  dispatch(onUnactiveSearch());
  dispatch(startLoading());
  const res = await fetchAlbumsThroughSearchQuery(query);
  if(res !== "Failed") {
    setOverlayResults(res.results);
    setOverlayType('options|album');
    dispatch(nullifyError());
  }
  else {
    setOverlayType(null);
    setFetchingError(`No Albums found for '${query}'`);
  }
  // console.log(res.results)
 }
 const onViewMoreArtists = async () => {
  dispatch(onUnactiveSearch());
  dispatch(startLoading());
  const res = await fetchArtistsThroughSearchQuery(query);
  if(res !== "Failed") {
    setOverlayResults(res.results);
    setOverlayType('options|artist');
    dispatch(nullifyError());
  }
  else
  {
    setOverlayType(null);
    setFetchingError(`No Artists found for '${query}'`);
  }
  // console.log(res.results)
 }


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

  if(overlayType !== null)
      switch(overlayType) {
        case "album": 
          return (
            <>
              <AlbumOverlay />
            </>
          )
        case 'artist': 
          return (
            <>
              <ArtistOverlay />
            </>
          )
        case "options|song": 
        case "options|album": 
        case "options|artist": 
          return (
            <>
              <MoreOptions backHandler={overlayBackHandler} type={overlayType} results={overlayResults} audioElement={audioElement}/>
            </>
          )
        default: 
          return (
            <>
              <InfoOverlay backHandler={overlayBackHandler} overlayType={overlayType} error={fetchingError} ><></></InfoOverlay>
            </>
          )
      }

  return (
   <section className='overflow-y-auto'>
     {data.topQuery.results.length > 0 && (
      <div className='w-full flex flex-col'>
        <span className='px-5 inline-flex justify-between items-center w-full h-12 border-b-[0.1px] border-t-0 border-x-0 border-solid border-white'>
          <h4 className='font-medium'>Top Results</h4>
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
          <button 
            onClick={onViewMoreSongs}
            className='px-2 py-1 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
            <p className='cursor-pointer text-xs font-normal'>View All</p>
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
         <button
          onClick={onViewMoreAlbums}
          className='px-2 py-1 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
          <p className='cursor-pointer text-xs font-normal'>View All</p>
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
         <button 
            onClick={onViewMoreArtists}
            className='px-2 py-1 bg-[#232323] border-none rounded-md hover:bg-[#343434] active:bg-[#121212] cursor-pointer'>
          <p className='cursor-pointer text-xs font-normal'>View All</p>
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