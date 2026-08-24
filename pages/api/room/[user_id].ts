// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import 'utils/connect-db';
import Room from 'models/Room';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import {
	FindRoomsCondition,
	GetParamsMoreThanOne as GetBodyMoreThanOne,
	MongooseRoomTypes,
	ResponseDataType,
	SortRoomsConditionType,
	SuccessRoomsReponse,
} from 'types';

const RoomUserAPI = async (
	_req: NextApiRequest,
	_res: NextApiResponse<
		ResponseDataType<SuccessRoomsReponse<MongooseRoomTypes>, unknown>
	>,
) => {
	const { method, body, cookies, query } = _req;

	const {
		user_id,
		room_id,
	}: Partial<{
		user_id: string;
		room_id: string;
	}> = query;

	const session: Session | null = await getServerSession(
		_req,
		_res,
		authOptions,
	);

	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     GET api/room/:user_id
		// @desc      Get All Private Rooms for the session user
		// @access    Private
		// @status    Works Properly with filter and pagination
		// @left      search Query
		case 'GET': {
			const {
				active,
				sort_by,
				search_query,
				page = 1,
				limit = 10,
			}: GetBodyMoreThanOne = body;

			try {
				const find_condition: FindRoomsCondition = {
					is_private: true,
					//  room_access_users: [`${user_id}`]
				};

				const total_entries: number =
					await Room.find(find_condition).countDocuments();

				let skip_entries: number = 0;

				if (
					page > 1 &&
					total_entries &&
					Math.ceil(total_entries / limit) > page
				) {
					skip_entries = limit * (page - 1);
				}

				if (typeof active === 'boolean') find_condition.active = active;

				const sort_condition: SortRoomsConditionType = {};

				// filters

				switch (sort_by) {
					case 'date:asc': {
						sort_condition.createdAt = 'asc';
						break;
					}
					case 'date:desc': {
						sort_condition.createdAt = 'desc';
						break;
					}
					case 'upvotes:asc': {
						sort_condition.upvotes = 'asc';
						break;
					}
					case 'upvotes:desc': {
						sort_condition.upvotes = 'desc';
						break;
					}
					default: {
					}
				}

				const rooms = await Room.find(find_condition)
					.sort(sort_condition)
					.skip(skip_entries)
					.limit(limit);

				const data: SuccessRoomsReponse<MongooseRoomTypes> = {
					rooms,
					limit,
					total_entries,
					page,
				};

				return _res.status(200).json({
					type: 'Success',
					data,
				});
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message,
				});
			}
		}
		default: {
			_res.setHeader('Allow', ['GET']);
			return _res.status(405).json({
				type: 'Failure',
				error: {
					message: `Method ${method} is Not Allowed for this API.`,
				},
			});
		}
	}
};

export default RoomUserAPI