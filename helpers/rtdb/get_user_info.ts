import axios from 'axios';
import { APIResponse } from 'types';

export default async function (props: { userId: string }) {
	try {
		const { data } = await axios.post<APIResponse<any>>(
			`${process.env.NEXTAUTH_URL ?? ''}/api/rtdb/get_user_info`,
			props,
		);
		return data;
	} catch (error: any) {
		return error.response;
	}
}
