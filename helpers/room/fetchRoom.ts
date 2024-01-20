import axios from 'axios';
import { APIResponse, MongooseRoomTypes } from 'types';

export default async function (room_slug: string) {
	try {
		const { data, status } = await axios.get<APIResponse<MongooseRoomTypes>>(
			`${process.env.NEXTAUTH_URL ?? ''}/api/room/get_room/${room_slug}`,
		);
		return data;
	} catch (error: any) {
		return error.response.data;
	}
}
