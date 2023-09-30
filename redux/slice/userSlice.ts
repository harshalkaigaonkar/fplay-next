import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InitialUserStateTypes, RootState } from 'types/redux';

const initialState : InitialUserStateTypes = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { updateUser } = userSlice.actions

export const selectUserInfo = (state: RootState) => state.user;
// export const selectCategories = (state: RootState) => state.bills.categories;
// export const selectBudget = (state: RootState) => state.bills.budget;

export default userSlice.reducer