import {Schema, model, models} from 'mongoose';
import { MongoosePlaylistTypes } from 'types';

const Playlist = new Schema<MongoosePlaylistTypes>({
 title: {
  type: String,
  required: true,
 },
 is_private: {
  type: Boolean,
  required: true,
  default: false
 },
 owned_by: {
  type: Schema.Types.ObjectId,
  ref: 'user'
 },
 songs: [{
  type: String,
 }]
},
{
 timestamps: true
});

export default models.playlist || model<MongoosePlaylistTypes>('playlist', Playlist)