// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument, Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import 'utils/connect-db';
import User from 'models/User';
import { MongoosePlaylistTypes } from 'types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ResponseDataType } from 'types';
import Playlist from 'models/Playlist';

const PlaylistAPI = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongoosePlaylistTypes, unknown>>,
) => {
	const { method, body, cookies } = _req;

	const session: Session | null = await getServerSession(
		_req,
		_res,
		authOptions,
	);
	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     POST api/playlists
		// @desc      Create a New Playlist
		// @access    Private
		// @status    Works Properly
		case 'POST': {
			const {
				title,
				songs,
				is_private,
			}: {
				title?: string;
				songs?: string[] | []; // Saavn Ids,
				is_private?: boolean;
			} = body;

			try {
				if (!title) throw new Error('Parameter title in Body is required!!');

				const user = await User.findOne({ email: session.user?.email });

				if (!user) throw new Error('User Not Found!!');

				const { _id } = user;

				const playlist = await Playlist.findOne({
					title,
					owned_by: new Types.ObjectId(`${_id}`),
				});

				if (playlist)
					return _res.status(200).json({
						type: 'Success',
						data: playlist,
					});

				const newPlaylist: HydratedDocument<MongoosePlaylistTypes> =
					new Playlist({
						title,
						owned_by: new Types.ObjectId(`${_id}`),
						is_private,
						songs,
					});

				await newPlaylist.save();

				return _res.status(201).json({
					type: 'Success',
					data: newPlaylist,
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

export default PlaylistAPI