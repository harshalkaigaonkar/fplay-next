// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose, { HydratedDocument } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import 'utils/connect-db';
import Room from 'models/Room';
import User from 'models/User';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import {
	FindRoomsCondition,
	MongooseRoomTypes,
	ResponseDataType,
	SortRoomsConditionType,
} from 'types';
import { genrateCustomId } from 'helpers';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongooseRoomTypes, unknown>>,
) => {
	const { method, body } = _req;

	const session: Session | null = await unstable_getServerSession(
		_req,
		_res,
		authOptions,
	);

	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     POST api/room
		// @desc      Create a New Room for Session User
		// @access    Private
		// @status    Works Properly
		case 'POST': {
			// room database object with options
			const {
				name,
				desc,
				genres,
				is_private,
				room_slug,
				// Taken care from room's POV
				// room_access_users,
				// owned_by, // would be from session's User ID.
				// later use of owned_by is for Groups
				// session_history, // would be empty initially
				// Changed to Library
				// pinned_playlists,
				// pinned_songs,
				// upvotes, // would be empty array initially
			} = body;

			try {
				if (!name) throw new Error('Name For Room is Required !!');

				const user = await User.findOne({
					email: session.user?.email,
				});

				if (!user) throw new Error('User Not Found!!');

				const { _id } = user;

				const room = await Room.findOne({ name });

				if (room)
					return _res.status(200).json({
						type: 'Success',
						data: room,
					});

				const newRoom: HydratedDocument<MongooseRoomTypes> = new Room({
					name,
					desc: desc ?? 'Join this Music Group!!',
					genres: genres ?? [],
					is_private: is_private ?? false,
					room_slug: room_slug ?? genrateCustomId(),
					//  room_access_users: room_access_users || [_id] ,
					owned_by: _id,
					//  session_history: [],
					//  pinned_playlists: pinned_playlists || [],
					//  pinned_songs: pinned_songs || [],
					upvotes: [],
				});
				await newRoom.save();
				await newRoom.populate('owned_by');

				return _res.status(201).json({
					type: 'Success',
					data: newRoom,
				});
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message.error ?? error.message,
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
