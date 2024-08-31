import { ref, runTransaction, set } from 'firebase/database';
import { randomUUID } from 'crypto';
import { rdbClient as db } from 'rt-functions';
import get_session_id_for_room from './get_session_id_for_room';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import 'utils/connect-db';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ResponseDataType } from 'types';
import axios from 'axios';

const RTDB_InitializeRoomForUser = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<boolean | string, unknown>>,
) => {
	const { method, body, cookies, query } = _req;

	const session: Session | null = await getServerSession(
		_req,
		_res,
		authOptions,
	);

	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		case 'POST': {
			const {
				roomInfo,
				userInfo,
			}: {
				roomInfo: any;
				userInfo: any;
			} = body;

			try {
				const { room_slug, owned_by } = roomInfo;
				const { _id: roomOwnerId } = owned_by;
				const { _id: userId } = userInfo;
				const sessionId = randomUUID();

				const session_def_obj = {
					current_queue: [],
					all_songs_queue: [],
					current_song_info: null,
					playing: false,
					seeking: false,
					is_active: true,
					room_slug,
				};

				const default_def_user_info = {
					user_info: userInfo,
					is_admin: userId === roomOwnerId,
					session_id: sessionId,
				};

				const roomRef = ref(db, `/rooms/room:${room_slug}`);
				const sessionRef = ref(db, `/sessions/session:${sessionId}`);
				const userRef = ref(db, `/users/user:${userId}`);

				const { data: room_exists } = await axios.post(
					`${process.env.NEXTAUTH_URL ?? ''}/api/rtdb/get_session_id_for_room`,
					{ roomSlug: room_slug },
				);

				console.log({ room_exists });

				if (!room_exists.data) {
					await runTransaction(roomRef, (session_id) => {
						if (!session_id) {
							return sessionId;
						}
					})
						.then((committed) => {
							if (!!committed) {
								runTransaction(sessionRef, (sessionData) => {
									if (!sessionData) {
										return session_def_obj;
									}
								})
									.then((committed) => {
										if (!!committed) {
											runTransaction(
												userRef,
												(userData) => {
													if (!userData) {
														return default_def_user_info;
													}
												},
											);
										}
									})
									.catch((error) =>
										console.log(
											`error:${JSON.stringify(error)}`,
										),
									);
							}
						})
						.catch((error) =>
							console.log(`error:${JSON.stringify(error)}`),
						);
				} else {
					set(userRef, default_def_user_info);
				}

				return _res.status(201).json({
					type: 'Success',
					data: true,
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

export default RTDB_InitializeRoomForUser;
