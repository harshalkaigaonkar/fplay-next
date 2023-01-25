import { DragDropContext, Droppable, resetServerContext } from "react-beautiful-dnd";
import Songs from 'songs.json';
import React, { FC, MutableRefObject, useState } from 'react'
import DraggableListItem from './item';
import EmptyQueue from "./empty";
import { useSelector } from "react-redux";
import { onReaarrangeSongQueue, selectSongsQueue } from "redux/slice/roomSlice";
import { useDispatch } from "react-redux";
import { TrackQueueProps } from "types/queue";

resetServerContext();

const DraggableList : FC<TrackQueueProps> = ({audioElement, fromPanel}) => {

	const songsQueue = useSelector(selectSongsQueue);

	const dispatch = useDispatch();

    const onDragEnd = (result: any) : void => {
		if (!result.destination) {
			return;
		}

		dispatch(onReaarrangeSongQueue({
			indexReplacedFrom: result.source.index, 
			indexReplacedTo: result.destination.index
		}))
    }

  return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <ul
					{...provided.droppableProps}
					ref={provided.innerRef}
					className={`relative z-10 -mt-16 mx-2 px-3 list-none lg:h-[36.5rem] max-h-auto flex flex-col justify-start rounded-b-lg overflow-y-auto`}
                >
					<li key="1" className="mt-16"></li>
					{
						songsQueue.length === 0 ? (
							<>
								<EmptyQueue />
							</>
						) 
						:
						(
							songsQueue.map(
								(song: any, index: number): JSX.Element => (
									<DraggableListItem song={song} index={index} audioElement={audioElement} fromPanel={fromPanel} />
								)
							)
						)
					}
					{provided.placeholder}
                </ul>
            )}
            </Droppable>
        </DragDropContext>
  )
}

export default DraggableList