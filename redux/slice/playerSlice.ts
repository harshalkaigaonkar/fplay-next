import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { freshPlayback } from 'helpers/playback';
import { PlaybackState, QueueTrack } from 'types';
import { InitialPlayerStateTypes, RootState } from 'types/redux';

const initialState: InitialPlayerStateTypes = {
	songsQueue: [],
	playback: freshPlayback(0),
	time: 0,
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		onSetupPlayer: (
			state,
			action: PayloadAction<{
				songsQueue: QueueTrack[];
				playback: PlaybackState;
			}>,
		) => {
			state.songsQueue = action.payload.songsQueue;
			state.playback = action.payload.playback;
		},
		onRefreshPlayer: () => initialState,
		onQueueUpdated: (state, action: PayloadAction<QueueTrack[]>) => {
			state.songsQueue = action.payload;
		},
		onPlaybackUpdated: (state, action: PayloadAction<PlaybackState>) => {
			if (action.payload.currentSongId !== state.playback.currentSongId)
				state.time = action.payload.position;
			state.playback = action.payload;
		},
		// Optimistic updates; the server's next queue-updated message replaces them.
		onReorderQueue: (
			state,
			action: PayloadAction<{ from: number; to: number }>,
		) => {
			const [moved] = state.songsQueue.splice(action.payload.from, 1);
			if (moved) state.songsQueue.splice(action.payload.to, 0, moved);
		},
		onRemoveFromQueue: (state, action: PayloadAction<string>) => {
			state.songsQueue = state.songsQueue.filter(
				(track) => track.id !== action.payload,
			);
		},
		onUpdateTime: (state, action: PayloadAction<number>) => {
			state.time = action.payload;
		},
	},
});

export const {
	onSetupPlayer,
	onRefreshPlayer,
	onQueueUpdated,
	onPlaybackUpdated,
	onReorderQueue,
	onRemoveFromQueue,
	onUpdateTime,
} = playerSlice.actions;

export const selectSongsQueue = (state: RootState) => state.player.songsQueue;
export const selectPlayback = (state: RootState) => state.player.playback;
export const selectCurrentSongId = (state: RootState) =>
	state.player.playback.currentSongId;
export const selectPaused = (state: RootState) => state.player.playback.paused;
export const selectTime = (state: RootState) => state.player.time;
export const selectCurrentTrack = (state: RootState) =>
	state.player.songsQueue.find(
		(track: QueueTrack) => track.id === state.player.playback.currentSongId,
	) ?? null;
export const selectPlayer = (state: RootState) => state.player;

export default playerSlice.reducer;
