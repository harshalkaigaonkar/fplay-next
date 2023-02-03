import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchSongsThroughSearchQuery } from 'helpers/music/fetchSongs';
import { Session } from 'next-auth';
import searchedSongs from 'searchAll.json';
import { SaavnSongObjectTypes } from 'types';
import { InitialSearchStateTypes, RootState } from 'types/redux';

const initialState : InitialSearchStateTypes = {
   query: "",
   results: null,
   loading: false,
   error: null,
   overlayOpen: false
}

export const searchSlice = createSlice({ 
  name: 'search',
  initialState,
  reducers: {  
    /**
     * 
     * @param state Refers to Current State
     * @param query refers to the update search query
     * @returns nothing
     */
    changeSearchQuery : (state, action: PayloadAction<string>) => {
     state.query = action.payload;
    },
    /**
     * @param state current state
     * @param result updated results
     * @returns nothing
    */
   updateSearchResults : (state, action: PayloadAction<any>) => {
     state.results = action.payload;
     state.loading = false;
     if(state.error)
     state.error = null;
    },
    /**
     * @param state current state
     * @param error api Error
     * @returns nothing
    */
   setError : (state, action: PayloadAction<string>) => {
     state.error = action.payload;
     state.loading = false;
     state.results = null;
    },
    /**
     * @param state current state
     * @returns nothing
     */
    clearQuery : (state) => {
      state.query = "";
      state.results = null;
      state.loading = false;
    },
    /**
     * @param state current state
     * @returns nothing
     */
    startLoading : (state) => {
      state.loading = true;
    },
    /**
     * @param state current state
     * @returns nothing
     */
    nullifyError : (state) => {
      state.error = null;
      state.loading= false;
    },
    /**
     * @param state current state
     * @returns nothing
     */
    openOverlay : (state) => {
      state.overlayOpen = true;
      state.loading= false;
    },
    /**
     * @param state current state
     * @returns nothing
     */
    closeOverlay : (state) => {
      state.overlayOpen = false;
    },
  }
})

export const {
 changeSearchQuery,
 updateSearchResults,
 startLoading,
 setError,
 nullifyError,
 clearQuery,
 openOverlay,
 closeOverlay
} = searchSlice.actions;

export const selectQuery = (state: RootState) => state.search.query;
export const selectResults = (state: RootState) => state.search.results;
export const selectLoading = (state: RootState) => state.search.loading;
export const selectError = (state: RootState) => state.search.error;
export const selectOverlayOpen = (state: RootState) => state.search.overlayOpen;

export default searchSlice.reducer