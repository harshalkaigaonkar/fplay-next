import axios from 'axios';
import { APIResponse, MongooseRoomTypes } from 'types';

export default async function(room_slug: string) {
 const {data} = await axios.get<APIResponse<MongooseRoomTypes>>(`/api/room/get_room/${room_slug}`);
 if(data.type === "Success") {
  return data.data;
 } else {
  return data.error;
 }
}