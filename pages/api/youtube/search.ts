import type { NextApiRequest, NextApiResponse } from 'next';
import redisManager from 'cache';
import { searchYouTube } from 'helpers/server/youtube';
import { QueueTrack, ResponseDataType } from 'types';

const YouTubeSearchAPI = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<QueueTrack[], string>>,
) => {
	// @route     GET api/youtube/search?q=
	// @desc      Search embeddable YouTube music videos (cached for a day)
	// @access    Private (auth middleware)
	if (_req.method !== 'GET') {
		_res.setHeader('Allow', ['GET']);
		return _res
			.status(405)
			.json({
				type: 'Failure',
				error: `Method ${_req.method} is Not Allowed.`,
			});
	}

	const query = typeof _req.query.q === 'string' ? _req.query.q.trim() : '';

	if (query.length < 2 || query.length > 100)
		return _res.status(400).json({
			type: 'Failure',
			error: 'Search needs 2 to 100 characters.',
		});

	try {
		await redisManager();
		const tracks = await searchYouTube(query);
		return _res.status(200).json({ type: 'Success', data: tracks });
	} catch (error: any) {
		console.error('YouTube search failed:', error);
		return _res
			.status(502)
			.json({
				type: 'Failure',
				error: 'Search is not available right now.',
			});
	}
};

export default YouTubeSearchAPI;
