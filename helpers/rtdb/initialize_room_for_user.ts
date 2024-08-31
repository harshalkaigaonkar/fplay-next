import axios from 'axios';
import { APIResponse } from 'types';

export default async function (props: { userInfo: any; roomInfo: any }) {
	try {
		const { data } = await axios.post<APIResponse<any>>(
			`${process.env.NEXTAUTH_URL ?? ''}/api/rtdb/initialize_room_for_user`,
			props,
		);
		return data;
	} catch (error: any) {
		return error.response;
	}
}
