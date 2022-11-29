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
 playlists: [{
  type: Schema.Types.ObjectId,
  ref: 'playlist',
  unique: true,
  required: true,
 }],
 rooms_on: [{
  type: Schema.Types.ObjectId,
  ref: 'room',
  unique: true,
  required: true,
 }]
},
{
 timestamps: true
});

export default models.user || model<MongooseUserTypes>('user', User)