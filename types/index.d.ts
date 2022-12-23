import mongoose, {Date, DateExpression, Document, Types} from "mongoose";

// export interface ServerToClientEvents {
//  noArg: () => void;
//  basicEmit: (a: number, b: string, c: Buffer) => void;
//  withAck: (d: string, callback: (e: number) => void) => void;
//  'ser': (any) => void;
// }

// export type ClientToServerEvents = {
//  'connect-to-server': (any) => void;
//  'connect-to-client': (any) => void;
//  'ser': (any) => void;
// }

// export interface InterServerEvents {
//  ping: () => void;
// }

// export interface SocketData {
//  name: string;
//  age: number;
// }

/**
 * SOCKET TYPES 
 */

export type ServerSocketData = Data | string 

export type SocketClientType = Socket<
ServerToClientEvents,
ClientToServerEvents
>
// Socket Types
export interface ServerToClientEvents {
 noArg: () => void;
 basicEmit: (a: number, b: string, c: Buffer) => void;
 withAck: (d: string, callback: (e: number) => void) => void;
 ser: (string) => void;
}
export type ClientToServerEvents = {
 'connect-to-server' : (any) => void;
 'ser': (any) => void;
 'create-room': (any) => void;
 'update-current-time': (any) => void;
}
export interface InterServerEvents {
 ping: () => void;
}
export interface SocketData {
 name: string;
 age: number;
}


// Mongoose DB Types

interface UserLibraryType {
  _doc: UserLibraryType;
  type: "Song"|"Playlist",
  playlist?: Types.ObjectId|string|MongoosePlaylistTypes,
  song?: string|SaavnSongObjectTypes,
 }
interface MongooseUserTypes extends Document {
 name: string,
 username: string,
 email: string,
 profile_pic: string|null,
 library: UserLibraryType[],
//  rooms_on: Types.ObjectId[]|string[],
}
interface MongooseRoomTypes extends Document {
 name: string,
 desc?: string,
 icon?: string,
 active: boolean,
 genres: Types.ObjectId[]|string[]|MongooseGenreTypes[],
 is_private: boolean,
//  room_access_users: Types.ObjectId[]|string[],
 owned_by: Types.ObjectId|MongooseUserTypes|string,
//  session_history: {
//   on_date: DateExpression,
//   songs: Types.ObjectId[]|string[],
//  },
//  pinned_songs: Types.ObjectId[]|string[],
//  pinned_playlists: Types.ObjectId[]|string[],
 upvotes: Types.ObjectId[]|string[]|MongooseUserTypes[]
}
interface MongoosePlaylistTypes extends Document {
 title: string,
 is_private: boolean,
 owned_by: Types.ObjectId|string|MongooseUserTypes,
 songs: string[]|SaavnSongObjectTypes[],
}
// interface MongooseSongTypes extends Document {
//  // _id: never
//  saavn_id: string,
//  name: string,
//  image: {
//   quality: string,
//   link: string
//  }[],
//  song_urls: {
//   quality: string,
//   link: string
//  }[],
//  primary_artists: String,
//  duration: String,
// }

interface SaavnSongObjectTypes {
  id: string,
  name: string,
  album?: {
    id: string,
    name: string,
    url: string
  },
  year?: string,
  releaseDate?: string,
  duration?: string,
  label?: string,
  primaryArtists?: string,
  primaryArtistsId?: string,
  explicitContent?: number,
  playCount?: number,
  language?: string,
  hasLyrics?: string,
  artist?: string,
  image: { 
    quality: string, 
    link: string 
  }[],
  url?: string,
  copyright?: string,
  downloadUrl: { 
    quality: string, 
    link: string
  }[],
  length?: number
 }
interface MongooseGenreTypes extends Document {
 type: string
}

/**
 * NEXT API ROUTES TYPES  
 * */

 interface IndexAPIResponseData {
  type: "API Server for fPlay",
  status: "Success",
 }
interface ResponseDataType<X, Y> {
 type: string,
 data?: X,
 error?: Y
}

/**
 * ROOM APIs INterfaces and Types
 */

 interface GetParamsMoreThanOne {
  active?: boolean, 
  sort_by?: "date:asc"|"date:desc"|"upvotes:asc"|"upvotes:desc", 
  owned_by?: string,
  search_query?: string, 
  page: number, 
  limit: number
}

interface SuccessRoomsReponse<T> {
  rooms?: T[],
  playlists?: T[],
  limit: number,
  total_entries: number,
  page: number
}[]

interface FindRoomsCondition {
  is_private: boolean,
  owned_by?: string,
  active?: boolean
}

type SortRoomsConditionType = {
  createdAt?: SortOrder,
  upvotes?: SortOrder
 }



interface AuthUserType {
  user: {
    name: string
    email: string
    image: string
  },
  expires: Date
}

interface APIResponse<T, U = string|{message:string}> {
  type: string,
  data?: T,
  error?: U
}

interface UseSession {
  data: Session|null, 
  status: string
}