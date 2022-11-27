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

export type Data = {
 name: string
}

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
 playlists: Types.ObjectId[],
 rooms_on: Types.ObjectId[],
}
interface MongooseRoomTypes extends Document {
 // _id?: Types.ObjectId,
 name: string,
 desc?: string,
 active: boolean,
 genres: Types.ObjectId[],
 is_private: boolean,
 room_access_users: Types.ObjectId[],
 socket_ids: string[],
 owned_by: Types.ObjectId,
 session_history: {
  on_date: DateExpression,
  songs: Types.ObjectId[],
 },
 pinned_songs: Types.ObjectId[],
 pinned_playlists: Types.ObjectId[],
 upvotes: Types.ObjectId[]
}
interface MongoosePlaylistTypes extends Document {
 // _id?: Types.ObjectId,
 name: string,
 owned_by: Types.ObjectId,
 songs: Types.ObjectId[],
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