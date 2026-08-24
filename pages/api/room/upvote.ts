// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import 'utils/connect-db';
import Room from 'models/Room';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { MongooseRoomTypes, ResponseDataType } from 'types';
import User from 'models/User';
import { Types } from 'mongoose';

const RoomUpvoteAPI = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongooseRoomTypes, unknown>>,
) => {
	const { method, body, query } = _req;

	const session: Session | null = await getServerSession(
		_req,
		_res,
		authOptions,
	);

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     POST api/room/upvotes?type="add"|"remove"
		// @desc      Add to/Remove From User's Library
		// @access    Private
		// @status    Works Properly(Test it, majorly never type on _id)
		case 'POST': {
			const {
				type,
			}: Partial<{
				type?: 'add' | 'remove';
			}> = query;

			const {
				room_id,
			}: {
				room_id: string;
			} = body;

			try {
				if (Object.keys(body).length === 0)
					throw new Error('Body is Required for this Call!!');

				const user = await User.findOne({
					email: session.user?.email,
				});

				if (!user) throw new Error('User Not Found!!');

				const { _id } = user;

				const room = await Room.findById(room_id);

				if (!room) throw new Error('Room Not Found!!');

				let update_room_obj: {
					upvotes?: Types.ObjectId[];
				} = {};

				if (type === 'add') {
					if (room.upvotes.includes(_id.toString()))
						throw new Error('User Already Upvoted!!');

					update_room_obj.upvotes = [_id.toString(), ...room.upvotes];
				} else {
					if (!room.upvotes.includes(_id.toString()))
						throw new Error('Not Upvoted Before to Remove!!');

					update_room_obj.upvotes = room.upvotes?.filter(
						(upvote_user_id: Types.ObjectId) =>
							upvote_user_id.toString() !== _id.toString(),
					);
				}

				const updated_room = await Room.findByIdAndUpdate(
					room_id,
					{
						$set: update_room_obj,
					},
					{
						new: true,
						select: 'upvotes',
					},
				);

				if (!updated_room) throw new Error('Upvote was not Updated!!');

				return _res.status(200).json({
					type: 'Success',
					data: updated_room.upvotes,
				});
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message,
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

export default RoomUpvoteAPI