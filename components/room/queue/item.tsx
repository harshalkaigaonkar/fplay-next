import { EllipsisVerticalIcon, HeartIcon, PauseIcon, PlayIcon, TrashIcon } from '@heroicons/react/20/solid'
import DragIcon from 'components/icon/dragIcon'
import SongPlaying from 'components/icon/playing'
import Image from 'next/image'
import React, { FC, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { onChangeClickedSongFromQueue, onSetPause, onSetPlay, selectCurrentSongId, selectPaused } from 'redux/slice/roomSlice'
import { DraggableListItemProps } from 'types/queue'


const DraggableListItem: FC<DraggableListItemProps> = ({song, index, audioElement, fromPanel}) => {

    const currentTrackId = useSelector(selectCurrentSongId);
    const paused = useSelector(selectPaused);

    const dispatch = useDispatch();
    
    const [showPlay, setShowPlay] = useState<boolean>(false);

    const onMouseEnterHandler = () => {
        setShowPlay(true);
    }
    const onMouseLeaveHandler = () => {
        setShowPlay(false);
    }

    const onClickHandler = (id: string) => {
        if(id !== currentTrackId)
            dispatch(onChangeClickedSongFromQueue(id));    
        if(!audioElement.current) return;
        if(audioElement.current.paused) {
            audioElement.current.play();
            dispatch(onSetPlay());
        }
        else
            audioElement.current.pause();
    }
    
  return (
    <Draggable
        key={song.id} 
        draggableId={song.id} 
        index={index}
    >
        {(provided, snapshot) => (
            <li
                key={song.id}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`${song.id === currentTrackId ? "scale-105 bg-white/10 " : "scale-100 bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-xl "} my-1 py-2 px-4 inline-flex flex-row items-center rounded-md transition ease-in-out duration-700`}
                onMouseEnter={onMouseEnterHandler}
                onMouseLeave={onMouseLeaveHandler}
                onClick={() => onClickHandler(song.id)}
            >
                <section className='w-3/4 inline-flex flex-row gap-5 items-center'>
                    <span className='relative inline-flex flex-col m-0 p-0 cursor-grab active:cursor-grabbing'>
                        <DragIcon className='w-5 h-5' />
                    </span> 
                    <span>
                        {/* Logic can be optimized later (brain not working now!!🤣) */}
                        {showPlay && (song.id !== currentTrackId ? (
                            <span className='absolute inline-flex items-center justify-center cursor-pointer bg-black/50 h-[45px] w-[45px] rounded-md z-10 animate-enter-div-2'>
                                <PlayIcon className='w-6 h-6' />
                            </span>
                        ):( !paused  ? (
                            <span className='absolute inline-flex items-center justify-center cursor-pointer bg-black/50 h-[45px] w-[45px] rounded-md z-10 animate-enter-div-2'>
                                <PauseIcon className='w-6 h-6' />
                            </span>
                        ): (
                            <span className='absolute inline-flex items-center justify-center cursor-pointer bg-black/50 h-[45px] w-[45px] rounded-md z-10 animate-enter-div-2'>
                                <PlayIcon className='w-6 h-6' />
                            </span>
                        )))}
                        {!showPlay && fromPanel && song.id === currentTrackId && (
                            <span className='absolute inline-flex items-center justify-center cursor-pointer bg-black/50 h-[45px] w-[45px] rounded-md z-10 animate-enter-div-2'>
                                <SongPlaying type={3} />
                            </span>
                        )}
                        <Image
                            src={song.image[1].link}
                            alt={`Song Icon ${song.image[1].quality}`}
                            width={45}
                            height={45}
                            className="rounded-md overflow-hidden z-0"
                        />
                    </span>
                    <span className='inline-flex flex-col gap-2 truncate'>
                        <h5 className='w-full font-semibold'>{song.name}</h5>
                        <h6 className='w-full font-normal'>{song.primaryArtists}{song.featuredArtists && ` ft. ${song.featuredArtists}`}</h6>
                    </span>
                </section>
                <div className='flex-0' />
                <section className='w-1/4 inline-flex flex-row justify-end gap-5'>
                    {/* <span>
                        <TrashIcon className='w-6 h-6' />
                    </span> */}
                    {song.id === currentTrackId && !paused && !fromPanel && (
                            <span className='inline-flex items-center justify-center cursor-pointer bg-inherit animate-enter-div'>
                                <SongPlaying type={3} />
                            </span>
                    )}
                    <span>
                        <HeartIcon className='w-6 h-6' />
                    </span>
                    <span>
                        <EllipsisVerticalIcon className='w-6 h-6' />
                    </span>
                </section>
            </li>
        )}
    </Draggable>  
  )
}

export default DraggableListItem