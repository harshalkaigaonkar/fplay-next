import { EllipsisVerticalIcon, HeartIcon, TrashIcon } from '@heroicons/react/20/solid'
import DragIcon from 'components/icon/dragIcon'
import Image from 'next/image'
import React, { FC } from 'react'
import { Draggable } from 'react-beautiful-dnd'

type DraggableListItemProps = {
    song: any,
    index: number,
}

const DraggableListItem: FC<DraggableListItemProps> = ({song, index}) => {
    
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
                className={`my-1 py-2 px-4 inline-flex flex-row bg-white/5 items-center rounded-md hover:bg-black hover:shadow-2xl`}
            >
                <section className='w-3/4 inline-flex flex-row gap-5 items-center'>
                    <span className='relative inline-flex flex-col m-0 p-0 cursor-grab active:cursor-grabbing'>
                        <DragIcon className='w-5 h-5' />
                    </span> 
                    <span>
                        <Image
                            src={song.image[1].link}
                            alt={`Song Icon ${song.image[1].quality}`}
                            width={45}
                            height={45}
                            className="rounded-md z-0"
                        />
                    </span>
                    <span className='inline-flex flex-col gap-2'>
                        <h5 className='w-full font-semibold'>{song.name}</h5>
                        <h6 className='font-normal'>{song.primaryArtists}{song.featuredArtists && ` ft. ${song.featuredArtists}`}</h6>
                    </span>
                </section>
                <div className='flex-0' />
                <section className='w-1/4 inline-flex flex-row justify-end gap-4'>
                    <span>
                        <TrashIcon className='w-6 h-6' />
                    </span>
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