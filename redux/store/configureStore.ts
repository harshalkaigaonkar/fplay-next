import { configureStore } from '@reduxjs/toolkit'
import roomSlice from 'redux/slice/roomSlice'
import userSlice from 'redux/slice/userSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    room: roomSlice
  }
})