import LoadingIcon from 'components/icon/loading';
import React from 'react';
import { useSelector } from 'react-redux';
import {
	selectError,
	selectLoading,
	selectResults,
} from 'redux/slice/searchSlice';
import PanelSongResult from './cards/song';
import { QueueTrack } from 'types';

const PanelSearched: React.FC = () => {
	const results = useSelector(selectResults);
	const loading = useSelector(selectLoading);
	const error = useSelector(selectError);

	if (loading) return <LoadingIcon className='w-10 h-10' />;

	if (error) return <p className='py-6'>{error}</p>;

	if (!results) return null;

	if (results.length === 0) return <p className='py-6'>No songs found.</p>;

	return (
		<section className='max-h-[34rem] overflow-y-auto py-2'>
			{results.map((track: QueueTrack) => (
				<PanelSongResult
					key={track.id}
					track={track}
				/>
			))}
		</section>
	);
};

export default PanelSearched;
