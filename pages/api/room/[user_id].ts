// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import 'utils/connect-db';
import Room from 'models/Room';
import User from 'models/User';
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

				const total_entries: number = await Room.find(find_condition).count();

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
			} catch (error) {
				return _res.status(500).json({
					type: 'Failure',
					error,
				});
			}
		}
		// // @route     POST api/room/:user_id
		// // @desc      Create a New Room for Session User
		// // @access    Private
		// // @status    Works Properly
		// case "POST": {
		//  const {
		//   room
		//   } = body;
		//  // room database object with options
		//  const {
		//   name,
		//   desc,
		//   active,
		//   genres,
		//   is_private,
		//   // Taken care from room's POV
		//   // room_access_users,
		//   // owned_by, // would be from session's User ID.
		//   // later use of owned_by is for Groups
		//   // session_history, // would be empty initially
		//   // Changed to Library
		//   // pinned_playlists,
		//   // pinned_songs,
		//   // upvotes, // would be empty array initially
		//  } = room;

		//  try {

		//   if(!name)
		//     throw new Error("Name For Room is Required !!");

		//   const user = await User.findById(user_id);

		//   if(!user)
		//    throw new Error("User Not Found!!");

		//   const {
		//     _id
		//   } = user;

		//   const room: MongooseRoomTypes|null = await Room.findOne({name});

		//   if(room)
		//     throw new Error("Room Already Exists!!");

		//   const newRoom: HydratedDocument<MongooseRoomTypes> = new Room({
		//    name,
		//    desc: desc || "Join this Music Group!!",
		//    active: active || false,
		//    genres: genres || [],
		//    is_private: is_private || false,
		//   //  room_access_users: room_access_users || [_id] ,
		//    owned_by: _id,
		//    session_history: [],
		//   //  pinned_playlists: pinned_playlists || [],
		//   //  pinned_songs: pinned_songs || [],
		//    upvotes: []
		//   });
		//   await newRoom.save();

		//   return _res.status(201).json({
		//    type: "Success",
		//    data: newRoom
		//   });
		//  } catch(error) {
		//   return _res.status(500).json({
		//    type:"Failure",
		//    error,
		//   })
		//  }
		// }
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