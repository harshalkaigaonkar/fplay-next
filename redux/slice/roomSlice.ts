import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { axiosGet } from 'helpers';
import { Session } from 'next-auth';
import songs from 'songs.json';
import { SaavnSongObjectTypes } from 'types';
import { InitialRoomStateTypes, RootState } from 'types/redux';

const initialState: InitialRoomStateTypes = {
	roomInfo: {},
	users: [],
	upvotes: 0,
	//helper state
	bottomSheet: false,
};

export const rooomSlice = createSlice({
	name: 'room',
	initialState,
	extraReducers: {},
	reducers: {
		onChangeUsers: (state, action) => {
			state.users = action.payload;
		},
		onLeaveUser: (state, action) => {
			state.users = state.users.filter(
				(item: any) => item.socket_id !== action.payload,
			);
		},
		onJoiningRoom: (state, action) => {
			state.roomInfo = action.payload;
		},
		onUpvote: (state) => {
			state.upvotes += 1;
		},
		onDownvote: (state) => {
			state.upvotes -= 1;
		},
		onClosePanel: (state) => {
			state.bottomSheet = false;
		},
		onOpenPanel: (state) => {
			state.bottomSheet = true;
		},
	},
});

export const {
	onDownvote,
	onUpvote,
	onClosePanel,
	onOpenPanel,
	onJoiningRoom,
	onChangeUsers,
	onLeaveUser,
} = rooomSlice.actions;

export const selectRoomInfo = (state: RootState) => state.room.roomInfo;
export const selectUsers = (state: RootState) => state.room.users;
export const selectUpvotes = (state: RootState) => state.room.upvotes;
export const selectBottomSheet = (state: RootState) => state.room.bottomSheet;
export const selectRoom = (state: RootState) => state.room;

export default rooomSlice.reducer;
