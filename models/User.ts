import {model, models, Schema}  from 'mongoose';
import { MongooseUserTypes } from 'types';

const User = new Schema<MongooseUserTypes>({
 name: {
  type: String,
  required: true
 },
 email: {
  type: String,
  required: true,
  unique: true,
 },
 username: {
  type: String,
  required: true,
  unique: true,
 },
 profile_pic: {
  type: String,
  unique: true,
 },
 library: [{
  type: {
   type: String,
   enum: ["Song", "Playlist"]
  },
  playlist: {
   type: Schema.Types.ObjectId,
   ref: 'playlist',
   unique: true
  },
  song: {
   type: String,
   unique: true,
  }
 }],
 // Keeping a Check on Rooms rather than on Users
 // rooms_on: [{
 //  type: Schema.Types.ObjectId,
 //  ref: 'room',
 //  unique: true,
 //  required: true,
 // }]
},
{
 timestamps: true
});

export default models.user || model<MongooseUserTypes>('user', User)