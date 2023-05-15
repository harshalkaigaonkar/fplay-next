import axios from 'axios';
import { APIResponse, MongooseUserTypes } from 'types';

export default async function(email: string) {
    try {
        const {data} = await axios.get<APIResponse<MongooseUserTypes>>(`${process.env.NEXTAUTH_URL}/api/user?email=${email}`);
        return data;
    } catch (error: any) {
        return error.response;
    }
}