import {Schema, model} from 'mongoose';
import { MongooseGenreTypes } from '../types';

const Genre = new Schema<MongooseGenreTypes>({
 type : {
  type: String,
  required: true,
  unique: true
 }
},
{
 timestamps: true
});

export default model<MongooseGenreTypes>('genre', Genre)