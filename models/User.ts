import {model, models, Schema}  from 'mongoose';
import { MongooseUserTypes, UserLibraryType } from 'types';

const LibrarySchema = new Schema<UserLibraryType>({
 type: {
  type: String,
  enum: ["Song", "Playlist"],
  required: true
 },
 playlist: {
  type: Schema.Types.ObjectId,
  ref: 'playlist',
  default: null,
  required: false
 },
 song: {
  type: String,
  default: null
 }
}, {
 _id:false
})

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
  unique:true
 },
 library: {
  type: [LibrarySchema],
  default: [],
  unique: false,
  required: false,
 },
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