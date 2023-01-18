import { EllipsisVerticalIcon, HeartIcon, PauseIcon, PlayIcon, TrashIcon } from '@heroicons/react/20/solid'
import DragIcon from 'components/icon/dragIcon'
import SongPlaying from 'components/icon/playing'
import Image from 'next/image'
import React, { FC, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'

type DraggableListItemProps = {
    song: any,
    index: number,
    currentIndex?: number,
    setCurrentIndex?: any
}

const DraggableListItem: FC<DraggableListItemProps> = ({song, index, currentIndex, setCurrentIndex}) => {

    const [showPlay, setShowPlay] = useState<boolean>(false)

    const onMouseEnterHandler = () => {
        setShowPlay(true);
    }
    const onMouseLeaveHandler = () => {
        setShowPlay(false);
    }

    const onClickHandler = (result: any) => {
        console.log(result)
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
                className={`${index === currentIndex ? "scale-105 bg-black " : "scale-100 bg-white/5 hover:bg-black hover:shadow-xl "} my-1 py-2 px-4 inline-flex flex-row items-center rounded-md transition duration-500`}
                onMouseEnter={onMouseEnterHandler}
                onMouseLeave={onMouseLeaveHandler}
                onClick={onClickHandler}
            >
                <section className='w-3/4 inline-flex flex-row gap-5 items-center'>
                    <span className='relative inline-flex flex-col m-0 p-0 cursor-grab active:cursor-grabbing'>
                        <DragIcon className='w-5 h-5' />
                    </span> 
                    <span>
                        {showPlay && index !== currentIndex && (
                            <span className='absolute inline-flex items-center justify-center cursor-pointer bg-black/50 h-[45px] w-[45px] z-10 animate-enter-div-2'>
                                <PlayIcon className='w-6 h-6' />
                            </span>
                        )}
                        {index === currentIndex && (
                            <span className='absolute inline-flex items-center justify-center cursor-pointer bg-black/50 h-[45px] w-[45px] z-10 animate-enter-div'>
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
                    <span className='inline-flex flex-col gap-2'>
                        <h5 className='w-full font-semibold'>{song.name}</h5>
                        <h6 className='font-normal'>{song.primaryArtists}{song.featuredArtists && ` ft. ${song.featuredArtists}`}</h6>
                    </span>
                </section>
                <div className='flex-0' />
                <section className='w-1/4 inline-flex flex-row justify-end gap-4'>
                    {/* <span>
                        <TrashIcon className='w-6 h-6' />
                    </span> */}
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