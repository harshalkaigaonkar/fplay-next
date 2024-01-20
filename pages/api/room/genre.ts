// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import 'utils/connect-db';
import Room from 'models/Room';
import Genre from 'models/Genre';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { MongooseGenreTypes, MongooseRoomTypes, ResponseDataType } from 'types';
import axios from 'axios';
import { HydratedDocument, Types } from 'mongoose';

export default async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongooseRoomTypes, unknown>>,
) => {
	const { method, body, cookies, query } = _req;

	const {
		type,
		genre,
	}: Partial<{
		type: 'add' | 'remove';
		genre: string;
	}> = query;

	const session: Session | null = await unstable_getServerSession(
		_req,
		_res,
		authOptions,
	);

	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     POST api/room/genre?genre="string"&type="add"/"remove"
		// @desc      Manipulate Genres to Add/Remove w.r.t Room
		// @access    Private
		// @status    Works Properly
		case 'POST': {
			const {
				room_id,
			}: {
				room_id: string;
			} = body;

			try {
				if (Object.keys(body).length === 0)
					throw new Error('Body is required for this Call!!');

				const room = await Room.findById(room_id);

				if (!room) throw new Error('Room Not Found!!');

				let genre_obj = await Genre.findOne({
					type: genre,
				});

				if (!genre_obj) {
					const data: HydratedDocument<MongooseGenreTypes> = new Genre({
						type: genre,
					});

					await data.save();

					if (!data) throw new Error('Genre Cannot be Added!!');

					genre_obj = data;
				}

				const update_room_obj: {
					genres?: Types.ObjectId[] | string[];
				} = {};

				const { _id } = genre_obj;

				if (type === 'add') {
					if (room.genres.includes(_id.toString()))
						throw new Error('Genre Already Attached to the Room!!');

					update_room_obj.genres = [...room.genres, _id.toString()];
				} else if (type === 'remove') {
					if (!room.genres.includes(_id.toString()))
						throw new Error('Genre is Not Attached to the Room!!');

					update_room_obj.genres = room.genres?.filter(
						(genre: Types.ObjectId) => genre.toString() !== _id.toString(),
					);
				} else {
					throw new Error('Other Types are Not Allowed!!');
				}

				const updated_room = await Room.findByIdAndUpdate(
					room_id,
					{
						$set: {
							genres: update_room_obj.genres,
						},
					},
					{
						new: true,
						select: 'genres',
					},
				);

				if (!updated_room)
					throw new Error('Genre Cannot Be Atached to the Room!!');

				return _res.status(201).json({
					type: 'Success',
					data: updated_room.genres,
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
