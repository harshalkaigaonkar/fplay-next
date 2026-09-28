import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import React, { FC } from 'react';
import DraggableListItem from './item';
import EmptyQueue from './empty';
import { useDispatch, useSelector } from 'react-redux';
import { onReorderQueue, selectSongsQueue } from 'redux/slice/playerSlice';
import { useSocket } from 'hooks/useSocket';
import { QueueTrack } from 'types';

const DraggableList: FC<{ fromPanel?: boolean }> = ({ fromPanel }) => {
	const songsQueue = useSelector(selectSongsQueue);
	const socket = useSocket();
	const dispatch = useDispatch();

	const onDragEnd = (result: DropResult): void => {
		if (!result.destination) return;
		const from = result.source.index;
		const to = result.destination.index;
		const track = songsQueue[from];
		if (!track || from === to) return;
		dispatch(onReorderQueue({ from, to }));
		socket.emit('move-track', { trackId: track.id, toIndex: to });
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='droppable'>
				{(provided) => (
					<ul
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={`relative z-10 -mt-16 mx-2 px-3 list-none lg:h-full lg:min-h-[36.5rem] max-h-auto flex flex-col justify-start rounded-b-lg overflow-y-auto overflow-x-hidden`}>
						<li
							key='1'
							className='mt-16'></li>
						{songsQueue.length === 0 ? (
							<EmptyQueue />
						) : (
							songsQueue.map(
								(
									track: QueueTrack,
									index: number,
								): JSX.Element => (
									<DraggableListItem
										key={track.id}
										track={track}
										index={index}
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
