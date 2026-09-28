import { PlaybackState } from 'types';

export const positionAt = (playback: PlaybackState, now: number): number =>
	playback.paused
		? playback.position
		: playback.position + (now - playback.updatedAt) / 1000;

export const freshPlayback = (now: number): PlaybackState => ({
	currentSongId: null,
	paused: true,
	position: 0,
	updatedAt: now,
});
