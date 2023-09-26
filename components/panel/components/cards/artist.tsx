import { EllipsisVerticalIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import AddToPlaylistIcon from 'components/icon/addToPlaylist';
import SongPlaying from 'components/icon/playing';
import { decodeHTMLContent } from 'helpers';
import { fetchSongObj } from 'helpers/music/fetchSongs';
import { useSocket } from 'hooks/useSocket';
import Image from 'next/image'
import React, {useState, useEffect, MutableRefObject} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { onAddSongIntoQueue, selectCurrentSongId, selectPaused, selectSongsQueue } from 'redux/slice/playerSlice';
import { selectRoomInfo } from 'redux/slice/roomSlice';

const PanelArtistResult: React.FC<{data: any, key: number, audioElement?: MutableRefObject<HTMLAudioElement|null>, onClickHandler: (id: string) => void}> = ({data, key, audioElement, onClickHandler}) => {

  const songsQueue = useSelector(selectSongsQueue)
  const currentSongId = useSelector(selectCurrentSongId);
  const paused = useSelector(selectPaused);
  const room = useSelector(selectRoomInfo);
  const socket = useSocket();
  const dispatch = useDispatch();

 const [mouseEnter, setMouseEnter] = useState<boolean>(false);
 const [addToQueueLoading, setAddToQueueLoading] = useState<0|1|2>(0);

 const mouseEnterHandler = () => {
  setMouseEnter(true);
 }

 const mouseLeaveHandler = () => {
  setMouseEnter(false);
 }

 const pauseHandler = () => {
  if(!audioElement?.current) return;
  audioElement.current.pause();
 }

 const addToQueueHandler = async () => {
  const songObj = await fetchSongObj(data.id);
  dispatch(onAddSongIntoQueue([songObj]));
  socket.emit("on-add-song-in-queue", {
    songObj,
    room_id: room.room_slug
   })
 }

  return (
    <div 
     key={key} 
     onMouseEnter={mouseEnterHandler} 
     onMouseLeave={mouseLeaveHandler} 
     onClick={() => onClickHandler(data.id)}
     className="w-60 h-16 m-2 px-3 bg-[#121212] hover:bg-[#343434] flex flex-row justify-start items-center gap-3 overflow-hidden rounded-lg cursor-pointer transition duration-500"
    >
      <Image
       src={data?.image?.[1]?.link ?? data?.image?.[0]?.link ?? "https://www.jiosaavn.com/_i/3.0/artist-default-music.png"}
       alt={data?.title + "_cover"}
       className={`${mouseEnter ? "rotate-0": "rotate-[20deg]"}
       rounded-full transition duration-300 cursor-pointer`}
       height={50}
       width={50}
       layout="fixed"
       loading='lazy'
      />
     <span className={`w-2/3 h-fit content-center`}>
      <p className='text-sm font-bold cursor-pointer truncate'>{decodeHTMLContent(data?.title ?? data.name)}</p>
      <p className='mt-1 text-[10px] font-normal cursor-pointer truncate'>{decodeHTMLContent(data?.description ?? data.role)}</p>
     </span>
     {/* {mouseEnter ? (
      <div className='mx-[1px] flex-1 flex flex-row items-center justify-evenly animate-enter-div-1'>
        {
          currentSongId === data.id && !paused ? (
            <button 
              className='p-2 h-fit rounded-full bg-black inline-flex items-center cursor-pointer hover:bg-black/30 active:bg-black/60'
              onClick={pauseHandler} 
            >  
              <PauseIcon className='w-5 h-5 text-white' />
            </button>
          ) : (
            <button className='p-2 h-fit rounded-full bg-black inline-flex items-center cursor-pointer hover:bg-black/30 active:bg-black/60'>
              <PlayIcon className='w-5 h-5 text-white' />
            </button>
          )
        }
        {
          data.type === 'song' && (
            <button 
              className='p-2 h-fit rounded-full bg-black inline-flex items-center cursor-pointer hover:bg-black/30 active:bg-black/60'
              onClick={addToQueueHandler}  
            >
              <AddToPlaylistIcon className='w-5 h-5 text-white' />
            </button>
          )
        }
      </div>
     ) :
      currentSongId === data.id && !paused && (
        <span className='flex-1 flex justify-center'>
          <SongPlaying type={3} />
        </span>
      )  
     } */}
    </div>
  )
}

export default PanelArtistResult