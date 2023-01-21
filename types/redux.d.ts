// Root State Types

import { Session } from "next-auth"
import { AuthUserType, SaavnSongObjectTypes } from "types"

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// User State types

type InitialUserStateTypes = {
    
}

type InitialRoomStateTypes = {
    songsQueue: SaavnSongObjectTypes[]|any[],
    currentSongId: string|null,
    paused: boolean,
    time: number,
    users: AuthUserType.user[]|any[],
    upvotes: number,
    bottomSheet: booelan
}