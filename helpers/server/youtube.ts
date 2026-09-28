import { client } from 'cache';
import { QueueTrack } from 'types';

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';
const ONE_DAY_SECONDS = 24 * 60 * 60;

export const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const apiKey = () => {
	const key = process.env.YOUTUBE_API_KEY;
	if (!key) throw new Error('YOUTUBE_API_KEY is not set');
	return key;
};

const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
};

// YouTube returns titles HTML-escaped ("Tum Hi Ho &amp; more"); decode to plain text.
export const decodeEntities = (text: string) =>
	text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
		if (code[0] === '#') {
			const value =
				code[1].toLowerCase() === 'x'
					? parseInt(code.slice(2), 16)
					: parseInt(code.slice(1), 10);
			return Number.isFinite(value) ? String.fromCodePoint(value) : match;
		}
		return NAMED_ENTITIES[code.toLowerCase()] ?? match;
	});

export const parseIsoDuration = (iso: string) => {
	const parts = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(
		iso,
	);
	if (!parts) return 0;
	const [, days, hours, minutes, seconds] = parts.map((part) =>
		Number(part ?? 0),
	);
	return ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
};

const cached = async <T>(key: string, load: () => Promise<T>): Promise<T> => {
	const hit = await client.get(key);
	if (hit) return JSON.parse(hit) as T;
	const value = await load();
	await client.set(key, JSON.stringify(value), { EX: ONE_DAY_SECONDS });
	return value;
};

const youtubeGet = async (path: string, params: Record<string, string>) => {
	const query = new URLSearchParams({ ...params, key: apiKey() });
	const response = await fetch(`${YOUTUBE_API}/${path}?${query}`);
	if (!response.ok)
		throw new Error(`YouTube API ${path} failed with ${response.status}`);
	return response.json();
};

// videos.list costs 1 quota unit per call; only playable, embeddable, non-live videos are kept.
const fetchTracks = async (ids: string[]): Promise<QueueTrack[]> => {
	if (ids.length === 0) return [];
	const { items = [] } = await youtubeGet('videos', {
		part: 'snippet,contentDetails,status',
		id: ids.join(','),
	});
	const byId = new Map<string, QueueTrack>();
	for (const video of items) {
		if (!video.status?.embeddable) continue;
		if (video.snippet?.liveBroadcastContent !== 'none') continue;
		byId.set(video.id, {
			id: video.id,
			title: decodeEntities(video.snippet.title ?? ''),
			channel: decodeEntities(video.snippet.channelTitle ?? ''),
			thumbnail:
				video.snippet.thumbnails?.medium?.url ??
				`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
			duration: parseIsoDuration(video.contentDetails?.duration ?? ''),
		});
	}
	return ids.flatMap((id) => byId.get(id) ?? []);
};

export const fetchYouTubeTrack = (videoId: string) =>
	cached(`fplay:yt-video:${videoId}`, async () => {
		const [track] = await fetchTracks([videoId]);
		return track ?? null;
	});

// search.list costs 100 quota units, so results are cached for a day per query.
export const searchYouTube = (query: string) =>
	cached(`fplay:yt-search:${query.trim().toLowerCase()}`, async () => {
		const { items = [] } = await youtubeGet('search', {
			part: 'snippet',
			type: 'video',
			videoCategoryId: '10',
			videoEmbeddable: 'true',
			maxResults: '15',
			q: query,
		});
		const ids: string[] = items
			.map((item: any) => item.id?.videoId)
			.filter((id: unknown) => typeof id === 'string');
		return fetchTracks(ids);
	});
