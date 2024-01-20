// Not Using Anymore, replaced by Hook - useSocket.

import {
	AsyncThunk,
	createAsyncThunk,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { Session } from 'next-auth';
import { Socket } from 'socket.io';
import { io } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketClientType } from 'types';
import { RootState } from 'types/redux';

let socket: SocketClientType | undefined;

const initialState: {
	socketSession: SocketClientType | null;
} = {
	socketSession: null,
};

const getSocketSession = createAsyncThunk(
	'socket/getClientSocketConnected',
	async () => {
		await axios.get('/api/socket');
		//ISSUE - There are a lot of client getting connected, have to resolve that.
		if (!socket) socket = io();
		return {
			socket,
		};
	},
);

export const socketSlice = createSlice({
	name: 'socket',
	initialState,
	extraReducers: {
		[getSocketSession.fulfilled as number | string | symbol | any]: (
			state: RootState,
			action: PayloadAction<SocketClientType>,
		) => {
			state.socketSession = action.payload.socket;
		},
	},
	reducers: {},
});

export { getSocketSession };

export const selectSocket = (state: RootState) => state.socket.socketSession;
// export const selectCategories = (state: RootState) => state.bills.categories;
// export const selectBudget = (state: RootState) => state.bills.budget;

export default socketSlice.reducer;
