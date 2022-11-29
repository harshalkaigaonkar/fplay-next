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
interface MongooseUserTypes extends Document {
 // _id: Types.ObjectId,
 name: string,
 username: string,
 email: string,
 profile_pic: string|null,
 playlists: Types.ObjectId[]|string[],
 rooms_on: Types.ObjectId[]|string[],
}
interface MongooseRoomTypes extends Document {
 // _id?: Types.ObjectId,
 name: string,
 desc?: string,
 active: boolean,
 genres: Types.ObjectId[]|string[],
 is_private: boolean,
 room_access_users: Types.ObjectId[]|string[],
 owned_by: Types.ObjectId|MongooseUserTypes|string,
 session_history: {
  on_date: DateExpression,
  songs: Types.ObjectId[]|string[],
 },
 pinned_songs: Types.ObjectId[]|string[],
 pinned_playlists: Types.ObjectId[]|string[],
 upvotes: Types.ObjectId[]|string[]
}
interface MongoosePlaylistTypes extends Document {
 // _id?: Types.ObjectId,
 name: string,
 owned_by: Types.ObjectId|string,
 songs: Types.ObjectId[]|string[],
}
interface MongooseSongTypes extends Document {
 // _id?: Types.ObjectId,
 saavn_id: string,
 name: string,
 image: {
  quality: string,
  link: string
 }[],
 song_urls: {
  quality: string,
  link: string
 }[],
 primary_artists: String,
 duration: String,
}
interface MongooseGenreTypes extends Document {
 // _id?: Types.ObjectId,
 type: string
}

/**
 * NEXT API ROUTES TYPES  
 * */

 interface Data {
  name: string
 }
interface ResponseDataType<X, Y> {
 type: string,
 data?: X,
 error?: Y
}

/**
 * ROOM APIs INterfaces and Types
 */

 interface GetRoomsBody {
  active?: boolean, 
  sort_by?: "date:asc"|"date:desc"|"upvotes:asc"|"upvotes:desc", 
  search_query?: string, 
  page: number, 
  limit: number
}

interface SuccessRoomsReponse {
  rooms: MongooseRoomTypes[],
  limit: number,
  total_entries: number,
  page: number
}[]

interface FindRoomsCondition {
  is_private: boolean,
  active?: boolean
}

type SortRoomsConditionType = {
  createdAt?: SortOrder,
  upvotes?: SortOrder
 }