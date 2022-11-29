import {Schema, model, models} from 'mongoose';
import { MongooseGenreTypes } from 'types';

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

export default models.genre || model<MongooseGenreTypes>('genre', Genre)