import BottomSheet from 'components/sheet';
import React, { FC } from 'react';
import PanelDraggableQueue from './components/queue';
import PanelSearch from './components/search';

const MediaPanel: FC = () => {
	return (
		<>
			<BottomSheet>
				<section className='flex flex-row w-full h-full'>
					<PanelSearch />
					<PanelDraggableQueue />
				</section>
			</BottomSheet>
		</>
	);
};

export default MediaPanel;
