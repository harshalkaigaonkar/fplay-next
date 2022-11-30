import mongoose, { Schema, model, models } from 'mongoose';
import { MongooseRoomTypes } from 'types';

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
 is_private: {
  type: Boolean,
  required: true,
  unique: true,
  default: false
 },
 room_access_users: [{
  type: Schema.Types.ObjectId,
  ref: 'user',
  unique: true
 }],
 owned_by: {
  type: Schema.Types.ObjectId,
  ref: "user"
 },
 // session_history: [{
 //  on_date: {
 //   type: Date,
 //   default: Date.now()
 //  },
 //  songs: [{
 //   saavn_id: {
 //    type: String,
 //    required: true,
 //   },
 //   title: String,
 //   image_url: {
 //    type: String,
 //    link: String
 //   }
 //  }]
 // }],
 // pinned_playlists: [{
 //  type: Schema.Types.ObjectId,
 //  ref: 'playlist',
 //  unique: true,
 // }],
 // pinned_songs: [{
 //  type: Schema.Types.ObjectId,
 //  ref: 'song',
 //  unique: true,
 // }],
 upvotes: [{
  type: Schema.Types.ObjectId,
  ref: "user",
  unique: true
 }],
},{
 timestamps: true
});

export default models.room || model<MongooseRoomTypes>('room', Room)