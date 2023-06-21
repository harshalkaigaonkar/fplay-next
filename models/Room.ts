import { generateCustomUuid } from 'custom-uuid';
import { genrateCustomId, ramdomEmojiText } from 'helpers';
import mongoose, { Schema, model, models, Types } from 'mongoose';
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
 icon: {
  type: String,
  default: ramdomEmojiText()
 },
 room_slug: {
    type: String,
    required: true,
 },
 genres: [{
  type: Schema.Types.ObjectId,
  ref: 'genre'
 }],
 is_private: {
  type: Boolean,
  required: true,
  default: false
 },
 // Later will take care of this
 // room_access_users: [{
 //  type: Schema.Types.ObjectId,
 //  ref: 'user',
 //  unique: true
 // }],
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
  ref: 'user'
 }],
},{
 timestamps: true
});

export default models.room || model<MongooseRoomTypes>('room', Room)