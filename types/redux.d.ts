// Root State Types

import { Session } from 'next-auth';
import {
	AuthUserType,
	MongooseUserTypes,
	PlaybackState,
	QueueTrack,
} from 'types';

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// User State types

type InitialUserStateTypes = {
	user: MongooseUserTypes | null;
};

type InitialRoomStateTypes = {
	roomInfo: MongooseRoomTypes | {};
	users: AuthUserType.user[] | any[];
	upvotes: number;
	bottomSheet: boolean;
	isAdmin: boolean;
};

type InitialPlayerStateTypes = {
	songsQueue: QueueTrack[];
	playback: PlaybackState;
	time: number;
};

type InitialSearchStateTypes = {
	query: string;
	results: QueueTrack[] | null;
	loading: boolean;
	error: string | null;
	overlayOpen: boolean;
	active: boolean;
};
