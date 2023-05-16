import axios from 'axios';
import { APIResponse, MongooseRoomTypes } from 'types';

export default async function(room_name: string) {
    try {
        const {data, status} = await axios.post<APIResponse<MongooseRoomTypes>>(`${process.env.NEXTAUTH_URL ?? ""}/api/room`, {
            "name": room_name
        });
        
        return data;
    } catch(error:any) {
        return error.response.data
    }
}