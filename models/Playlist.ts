import {Schema, model, models} from 'mongoose';
import { MongoosePlaylistTypes } from 'types';

const Playlist = new Schema<MongoosePlaylistTypes>({
 name: {
  type: String,
  required: true,
  unique: true,
 },
 owned_by: {
  type: Schema.Types.ObjectId,
  ref: 'user'
 },
 songs: [{
  type: Schema.Types.ObjectId,
  ref: 'song',
  unique: true,
 }]
},
{
 timestamps: true
});

export default models.playlist || model<MongoosePlaylistTypes>('playlist', Playlist)