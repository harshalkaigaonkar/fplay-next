import axios from 'axios';
import { APIResponse, MongooseUserTypes } from 'types';

export default async function(email: string) {
 const {data} = await axios.get<APIResponse<MongooseUserTypes>>(`/api/user?email=${email}`);
 if(data.type === "Success") {
  return data.data;
 } else {
  return data.error;
 }
}