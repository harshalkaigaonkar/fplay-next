import {
	DragDropContext,
	Droppable,
	resetServerContext,
} from 'react-beautiful-dnd';
import Songs from 'songs.json';
import React, { FC, MutableRefObject, useState } from 'react';
import DraggableListItem from './item';
import EmptyQueue from './empty';
import { useSelector } from 'react-redux';
import {
	onReaarrangeSongQueue,
	selectSongsQueue,
} from 'redux/slice/playerSlice';
import { useDispatch } from 'react-redux';
import { TrackQueueProps } from 'types/queue';
import { selectRoomInfo } from 'redux/slice/roomSlice';
import { selectUserInfo } from 'redux/slice/userSlice';

resetServerContext();

const DraggableList: FC<TrackQueueProps> = ({ audioElement, fromPanel }) => {
	const songsQueue = useSelector(selectSongsQueue);
	const room = useSelector(selectRoomInfo);
	const user = useSelector(selectUserInfo);

	const dispatch = useDispatch();

	const onDragEnd = (result: any): void => {
		if (!result.destination) {
			return;
		}
		const indexes = {
			indexReplacedFrom: result.source.index,
			indexReplacedTo: result.destination.index,
		};

		dispatch(onReaarrangeSongQueue(indexes));
		// socket.emit('on-replace-song-in-queue', {
		// 	user,
		// 	replace_from: indexes.indexReplacedFrom,
		// 	to_replace: indexes.indexReplacedTo,
		// 	room_id: room.room_slug,
		// });
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='droppable'>
				{(provided, snapshot) => (
					<ul
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={`relative z-10 -mt-16 mx-2 px-3 list-none lg:h-full lg:min-h-[36.5rem] max-h-auto flex flex-col justify-start rounded-b-lg overflow-y-auto overflow-x-hidden`}>
						<li
							key='1'
							className='mt-16'></li>
						{songsQueue.length === 0 ? (
							<>
								<EmptyQueue />
							</>
						) : (
							!!songsQueue &&
							songsQueue?.map(
								(song: any, index: number): JSX.Element => (
									<DraggableListItem
										key={index}
										song={song}
										index={index}
										audioElement={audioElement}
										fromPanel={fromPanel}
									/>
								),
							)
						)}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default DraggableList;
