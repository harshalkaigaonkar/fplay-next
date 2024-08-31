import { child, get, ref } from 'firebase/database';
import { rdbClient as db } from 'rt-functions';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import 'utils/connect-db';
import Room from 'models/Room';
import {
	FindRoomsCondition,
	GetParamsMoreThanOne,
	MongooseRoomTypes,
	ResponseDataType,
	SortRoomsConditionType,
	SuccessRoomsReponse,
} from 'types';

const RTDB_GetSessionIdForRooms = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<any, unknown>>,
) => {
	const { method, body, query } = _req;

	switch (method) {
		case 'POST': {
			const { roomSlug }: { roomSlug: string } = body;

			try {
				const dbRef = ref(db);
				const roomRef = child(dbRef, `/rooms/room:${roomSlug}`);
				const sessionId = await get(roomRef)
					.then((snapshot) => snapshot.val())
					.catch((error) => console.log(error));

				return _res.status(200).json({
					type: 'Success',
					data: sessionId,
				});
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message.error || error.message,
				});
			}
		}
		default: {
			_res.setHeader('Allow', ['POST']);
			return _res.status(405).json({
				type: 'Failure',
				error: {
					message: `Method ${method} is Not Allowed for this API.`,
				},
			});
		}
	}
};

export default RTDB_GetSessionIdForRooms;
