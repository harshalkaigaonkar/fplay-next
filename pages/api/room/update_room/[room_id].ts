// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import 'utils/connect-db';
import Room from 'models/Room';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { MongooseRoomTypes, ResponseDataType } from 'types';

/**
 * Type Interfaces fot the File
 */
interface UpdateRoomObject {
	name?: string;
	desc?: string;
	icon?: string;
	active?: boolean;
	is_private?: boolean;
}

const UpdateRoomAPI = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongooseRoomTypes, unknown>>,
) => {
	const { method, body, cookies, query } = _req;

	const {
		room_id,
	}: Partial<{
		room_id: string;
	}> = query;

	const session: Session | null = await unstable_getServerSession(
		_req,
		_res,
		authOptions,
	);

	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     PUT api/room/update_room/:room_id
		// @desc      Get a Room's Complete Info
		// @access    Private
		// @status    Works Properly, Need Some Types to be defined (line:80)
		case 'PUT': {
			const { name, desc, icon, active, is_private }: UpdateRoomObject = body;

			if (Object.keys(body).length === 0)
				return _res.status(400).json({
					type: 'Failure',
					error: 'Body is required for this Call!!',
				});

			const update_room_obj: UpdateRoomObject = {};

			if (name) update_room_obj.name = name;
			if (desc) update_room_obj.desc = desc;
			if (icon) update_room_obj.icon = icon;
			if (active) update_room_obj.active = active;
			if (is_private) update_room_obj.is_private = is_private;

			try {
				// Check on types here
				const room = await Room.findById(room_id);

				if (!room) throw new Error('No Room Found!!');

				const populate_array: string[] = [];

				if (room.owned_by) populate_array.push('owned_by');

				await room.populate(populate_array.join(' '));

				if (room.owned_by.email !== session.user?.email)
					throw new Error('You Cannot Update the Details');

				const data = await Room.findByIdAndUpdate(
					room_id,
					{
						$set: update_room_obj,
					},
					{
						new: true,
					},
				);

				if (data)
					return _res.status(200).json({
						type: 'Success',
						data,
					});

				throw new Error('Room Details Cannot be Updated!!');
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message.error || error.message,
				});
			}
		}
		default: {
			_res.setHeader('Allow', ['PUT']);
			return _res.status(405).json({
				type: 'Failure',
				error: {
					message: `Method ${method} is Not Allowed for this API.`,
				},
			});
		}
	}
};

export default UpdateRoomAPI