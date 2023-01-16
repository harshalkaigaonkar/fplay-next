import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Session } from 'next-auth';
import { InitialUserStateTypes, RootState } from 'types/redux';

const initialState : InitialUserStateTypes = {
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  }
})

// export const {  } = userSlice.actions

// export const userSession = (state: RootState) => state.session;
// export const selectCategories = (state: RootState) => state.bills.categories;
// export const selectBudget = (state: RootState) => state.bills.budget;

export default userSlice.reducer