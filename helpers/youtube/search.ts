import axios from 'axios';
import { APIResponse, QueueTrack } from 'types';

export const searchTracks = async (query: string): Promise<QueueTrack[]> => {
	const { data } = await axios.get<APIResponse<QueueTrack[]>>(
		'/api/youtube/search',
		{ params: { q: query } },
	);
	return data.data ?? [];
};
