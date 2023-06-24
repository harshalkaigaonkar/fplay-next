import { configureStore } from '@reduxjs/toolkit'
import playerSlice from 'redux/slice/playerSlice'
import rooomSlice from 'redux/slice/roomSlice'
import searchSlice from 'redux/slice/searchSlice'
import userSlice from 'redux/slice/userSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    room: rooomSlice,
    search: searchSlice,
    player: playerSlice,
  }
})