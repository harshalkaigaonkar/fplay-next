import {
	DatabaseReference,
	get,
	ref,
	runTransaction,
	set,
} from 'firebase/database';
import { rdbClient as db } from 'rt-functions';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import 'utils/connect-db';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ResponseDataType } from 'types';
import axios from 'axios';

const RTDB_SyncRoomWhenUserLeaves = async (
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
				userId,
			}: {
				userId: string;
			} = body;

			try {
				const userRef = ref(db, `/users/user:${userId}`);
				const usersObjRef = ref(db, `/users`);
				const roomsObjRef = ref(db, `/rooms`);

				if (userId) {
					let sessionRef: DatabaseReference;

					let isAdmin_user: boolean;

					await runTransaction(usersObjRef, (users) => {
						if (users && users[`user:${userId}`]) {
							const user = users[`user:${userId}`];
							if (user) {
								isAdmin_user = user.is_admin;
								sessionRef = ref(
									db,
									`/sessions/session:${user.session_id}`,
								);
							}
							delete users[`user:${userId}`];
						}
						return users;
					})
						.then((committed) => {
							if (!!committed && !!isAdmin_user && !!sessionRef) {
								runTransaction(sessionRef, (session) => {
									return {
										...session,
										// setting default value of session when admin has left room.
										playing: false,
										seeking: false,
										is_active: false,
									};
								})
									.then((committed) => {
										if (!!committed) {
											runTransaction(
												roomsObjRef,
												(rooms) => {
													const sessionInfoValue =
														committed.snapshot.val();
													if (
														!!rooms &&
														!!sessionInfoValue &&
														!!sessionInfoValue.room_slug
													) {
														delete rooms[
															`room:${sessionInfoValue.room_slug}`
														];
													}
													return rooms;
												},
											);
										}
									})
									.catch((err) => console.log('err', err));
							}
						})
						.catch((err) => console.log('err', err));
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

export default RTDB_SyncRoomWhenUserLeaves;
