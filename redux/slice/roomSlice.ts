import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { axiosGet } from 'helpers';
import { Session } from 'next-auth';
import songs from 'songs.json';
import { SaavnSongObjectTypes } from 'types';
import { InitialRoomStateTypes, RootState } from 'types/redux';

const initialState : InitialRoomStateTypes = {
    roomInfo: {},
    songsQueue: [],
    currentSongId: null,
    paused: true,
    time: 0,
    users: [],
    upvotes: 0,
    //helper state
    bottomSheet: false
}

export const rooomSlice = createSlice({ 
  name: 'room',
  initialState,
  extraReducers: {

  },
  reducers: {  
    /**
     * @status ONLY ON FOR FRONTEND TESTING
     * @param state Refers to Current State
     * @returns current song queue
     */
    onGetSongsQueue: (state): void => {
        // state.songsQueue = songs;
        // if(!state.currentSongId) state.currentSongId = songs[0].id
    },
    /**
     * 
     * @param state refers to current state
     * @param action contains SaavnSongObjectType Data [Type is not proper, added any]
     * @returns updated songs queue
     */
    onAddSongIntoQueue: (state, action: PayloadAction<SaavnSongObjectTypes|SaavnSongObjectTypes[]|any>) => {
        if(
            action.payload.length 
            && 
            state.songsQueue.find(
                (item: SaavnSongObjectTypes) => {
                   return action.payload.find((addItem: SaavnSongObjectTypes) => addItem.id === item.id) ? true: false;
                })
        )
        return;
        const updatedSongsQueue = state.songsQueue.concat(action.payload);
        state.songsQueue = updatedSongsQueue;
        if(!state.currentSongId) state.currentSongId = updatedSongsQueue[0].id
    },
    /**
     * 
     * @param state refers to current state
     * @param action refers to index from queue
     * @returns updated songs queue
     */
    onRemoveSongFromQueue: (state, action: PayloadAction<string>): SaavnSongObjectTypes[]|any => {
        if(!state.songsQueue.find((item: SaavnSongObjectTypes) => item.id === action.payload))
            return {
                type: 'error',
                error: "Id does not exist in Queue!!"
            }

        const updatedSongsQueue = state.songsQueue.filter((item: SaavnSongObjectTypes) => item.id !== action.payload);
        state.songsQueue = updatedSongsQueue;
    },
    /**
     * 
     * @param state 
     * @param action {indexReplacedFrom : number, indexReplacedTo : number}
     * @returns updated songs queue
     */
    onReaarrangeSongQueue: (state, action: PayloadAction<{indexReplacedFrom : number, indexReplacedTo : number}>): SaavnSongObjectTypes[]|any => {
        if(state.songsQueue.length-1 <  action.payload.indexReplacedFrom || state.songsQueue.length-1 <  action.payload.indexReplacedTo)
            return;
        let updatedSongsQueue = state.songsQueue;
        const [removed] = updatedSongsQueue.splice(action.payload.indexReplacedFrom, 1);
        updatedSongsQueue.splice(action.payload.indexReplacedTo, 0, removed);
    },
    onUpdateTime: (state, action: PayloadAction<number>) => {
        state.time = action.payload;
    },
    onChangeClickedSongFromQueue: (state, action: PayloadAction<string>) => {
        state.currentSongId = action.payload;
    },
    onChangeNextSongFromQueue: (state) => {
        const index = state.songsQueue.findIndex((item) => item.id === state.currentSongId);
        if(state.songsQueue.length === index+1) {
            state.currentSongId = state.songsQueue[0].id;
            return;
        }
        state.currentSongId = state.songsQueue[index+1].id;
    },
    onChangePrevSongFromQueue: (state) => {
        const index = state.songsQueue.findIndex((item) => item.id === state.currentSongId);
        if(index-1 === -1) {
            state.currentSongId = state.songsQueue[state.songsQueue.length-1].id;
            return;
        }
        state.currentSongId = state.songsQueue[index-1].id;
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
    onSetPlay: (state) => {
        state.paused = false;
    },
    onSetPause: (state) => {
        state.paused = true;
    },
    onClosePanel: (state) => {
        state.bottomSheet = false;
    },
    onOpenPanel: (state) => {
        state.bottomSheet = true;
    }
  }
})

export const { 
    onAddSongIntoQueue, 
    onGetSongsQueue,
    onRemoveSongFromQueue, 
    onReaarrangeSongQueue, 
    onDownvote, 
    onUpvote ,
    onSetPlay,
    onSetPause,
    onUpdateTime,
    onChangeNextSongFromQueue,
    onChangePrevSongFromQueue,
    onChangeClickedSongFromQueue,
    onClosePanel,
    onOpenPanel,
    onJoiningRoom
} = rooomSlice.actions;

export const selectRoomInfo = (state: RootState) => state.room.roomInfo;
export const selectSongsQueue = (state: RootState) => state.room.songsQueue;
export const selectCurrentSongId = (state: RootState) => state.room.currentSongId;
export const selectPaused = (state: RootState) => state.room.paused;
export const selectTime = (state: RootState) => state.room.time;
export const selectUsers = (state: RootState) => state.room.users;
export const selectUpvotes = (state: RootState) => state.room.upvotes;
export const selectBottomSheet = (state: RootState) => state.room.bottomSheet;

export default rooomSlice.reducer