import { DragDropContext, Droppable, resetServerContext } from "react-beautiful-dnd";
import Songs from 'songs.json';
import React, { FC, useState } from 'react'
import DraggableListItem from './item';
import EmptyQueue from "./empty";

resetServerContext();

const DraggableList : FC = () => {

	const [songs, setSongs] = useState<any>(Songs);

	const reorderSongs = (songs: any, indexReplacedFrom : number, indexReplacedTo : number) => {
		const result = Array.from(songs);
		const [removed] = result.splice(indexReplacedFrom, 1);
		result.splice(indexReplacedTo, 0, removed);
		setSongs(result);
	}

    const onDragEnd = (result: any) : void => {
		if (!result.destination) {
			return;
		}
		reorderSongs(
			songs, 
			result.source.index, 
			result.destination.index
		);
    }

  return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <ul
					{...provided.droppableProps}
					ref={provided.innerRef}
					className={`relative z-10 -mt-16 mx-5 px-1 list-none lg:h-[35rem] max-h-auto flex flex-col justify-start rounded-b-lg overflow-y-auto`}
                >
					<li key="1" className="mt-16"></li>
					{
						songs.length === 0 ? (
							<>
								<EmptyQueue />
							</>
						) 
						:
						(
							songs.map(
								(song: any, index: number): JSX.Element => (
									<DraggableListItem song={song} index={index} />
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