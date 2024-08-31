import axios from 'axios';
import { APIResponse } from 'types';

export default async function (props: { roomSlug: string }) {
	try {
		const { data } = await axios.post<APIResponse<any>>(
			`${process.env.NEXTAUTH_URL ?? ''}/api/rtdb/get_session_id_for_room`,
			props,
		);
		return data;
	} catch (error: any) {
		return error.response;
	}
}
