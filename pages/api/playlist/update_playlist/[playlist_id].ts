// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import 'utils/connect-db';
import User from 'models/User';
import { MongoosePlaylistTypes, MongooseUserTypes } from 'types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ResponseDataType } from 'types';
import Playlist from 'models/Playlist';

const UpdatePlaylistAPI = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongoosePlaylistTypes, unknown>>,
) => {
	const { method, body, cookies, query } = _req;

	const {
		playlist_id,
		type,
	}: Partial<{
		playlist_id: string;
		type: 'add' | 'remove';
	}> = query;

	const session: Session | null = await unstable_getServerSession(
		_req,
		_res,
		authOptions,
	);
	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     POST api/playlists/update_playlists/:playlist_id?type="add/remove"
		// @desc      Update a Playlist
		// @access    Private
		// @status    Works Properly(test it.)
		case 'POST': {
			const {
				title,
				songs,
				is_private,
			}: {
				title?: string;
				songs?: string[] | [string]; // Saavn Ids, only one is there while removing,
				is_private?: boolean;
			} = body;

			try {
				if (songs && songs.length === 0)
					throw new Error('Song Ids Required for Adding/Removing');

				const playlist = await Playlist.findById(playlist_id);

				if (!playlist) throw new Error('Playlist Not Found!!');

				const user = await User.findOne({ email: session.user?.email });

				if (!user) throw new Error('User Not Found!!');

				const { _id } = user;

				if (playlist.owned_by.toString() !== _id.toString())
					throw new Error('Not Permitted to Update!!');

				let update_playlist_obj: {
					title?: string;
					is_private?: boolean;
					songs?: string[];
				} = {};

				if (title) update_playlist_obj.title = title;
				if (is_private) update_playlist_obj.is_private = is_private;

				let remove_song_check: boolean = false;

				if (songs && songs.length > 0) {
					playlist.songs.forEach((song: string) => {
						if (songs.includes(song) && type === 'add') {
							return _res.status(200).json({
								type: 'Success',
								data: playlist.songs,
							});
						}

						if (songs.includes(song) && type === 'remove') {
							remove_song_check = true;
						}
					});

					if (
						(!remove_song_check || playlist.songs.length === 0) &&
						type === 'remove'
					)
						throw new Error(`Song ${songs[0]} Not Found to be Removed!!`);

					if (type === 'add')
						update_playlist_obj.songs = [...songs, ...playlist.songs];
					else if (type === 'remove')
						update_playlist_obj.songs = playlist.songs.filter(
							(song: string) => songs[0] !== song,
						);
				}

				const updated_playlist = await Playlist.findByIdAndUpdate(
					playlist_id,
					{
						$set: update_playlist_obj,
					},
					{
						new: true,
						select: 'songs',
					},
				);

				return _res.status(201).json({
					type: 'Success',
					data: updated_playlist.songs,
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

export default UpdatePlaylistAPI