import AddTrackPanelIcon from 'components/icon/addTrack';
import React from 'react';

// Not exisiting Currently
const MusicPanelButton = () => {
	return (
		<div className='fixed bottom-0 right-0 z-40 m-8 p-20 bg-black border-solid border-white/50 rounded-full cursor-pointer transition duration-300 hover:border-white/5 hover:bg-white/10 active:bg-white/20'>
			<AddTrackPanelIcon className='w-12 h-12 text-white' />
		</div>
	);
};

export default MusicPanelButton;
