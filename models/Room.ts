import mongoose, { Types, Schema, model } from 'mongoose';
import { MongooseRoomTypes } from '../types';

const Room = new Schema<MongooseRoomTypes>({
 name: {
  type: String,
  required: true,
  unique: true,
 },
 desc: {
  type: String,
  default: "Join this Music Group!!"
 },
 active: {
  type: Boolean,
  required: true,
  unique: true,
  default: true
 },
 genres: [{
  type: Schema.Types.ObjectId,
  ref: 'genre',
  required: true,
  unique: true
 }],
 private: {
  type: Boolean,
  required: true,
  unique: true,
  default: false
 },
 owned_by: {
  type: Schema.Types.ObjectId,
  ref: "user"
 },
 session_history: [{
  on_date: {
   type: Date,
   default: Date.now()
  },
  songs: [{
   type: Schema.Types.ObjectId,
   ref: 'song'
  }]
 }],
 pinned_playlists: [{
  type: Schema.Types.ObjectId,
  ref: 'playlist',
  unique: true,
 }],
 pinned_songs: [{
  type: Schema.Types.ObjectId,
  ref: 'song',
  unique: true,
 }],
 upvotes: [{
  type: Schema.Types.ObjectId,
  ref: "user"
 }]
},{
 timestamps: true
});

export default model<MongooseRoomTypes>('room', Room)