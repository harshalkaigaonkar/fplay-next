// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import 'utils/connect-db';
import User from 'models/User';
import { MongooseUserTypes, ResponseDataType } from 'types';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongooseUserTypes, unknown>>,
) => {
	const { method, query, cookies, body } = _req;

	const {
		user_id,
	}: Partial<{
		user_id: string;
	}> = query;

	const session: Session | null = await unstable_getServerSession(
		_req,
		_res,
		authOptions,
	);

	//  console.log("Cookies: ", cookies)

	if (!session) return _res.status(401).redirect('/login');

	switch (method) {
		// @route     GET api/user/:user_id
		// @desc      Get User's Info from Database
		// @access    Private
		// @status    Works Properly
		case 'GET': {
			try {
				const user =
					(await User.findById(user_id)) ||
					(await User.findOne({ email: session.user?.email }));

				if (user)
					return _res.status(200).json({
						type: 'Success',
						data: user,
					});

				throw new Error('No User Found !!');
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message.error || error.message,
				});
			}
		}
		// @route     PUT api/user/:id
		// @desc      Update User's Info (Name, username, email)
		// @access    Private
		// @status    Works Properly
		case 'PUT': {
			const { name, username, email } = body;

			/**
			 * selected to Options for Updation
			 * only these body props are allowed
			 */

			const update_profile_obj: {
				name?: string;
				username?: string;
				email?: string;
			} = {};

			if (name) update_profile_obj.name = name;
			if (email) update_profile_obj.email = email;
			if (username) update_profile_obj.username = '@' + username;

			try {
				const user =
					(await User.findById(user_id)) ||
					(await User.findOne({ email: session.user?.email }));

				if (!user) throw new Error('No User Found to Update Details!!');

				const updated_user = await User.findByIdAndUpdate(
					user_id,
					update_profile_obj,
				);

				if (!updated_user) throw new Error('User Not Updated!!');

				return _res.status(201).json({
					type: 'Success',
					data: updated_user,
				});
			} catch (error) {
				return _res.status(500).json({
					type: 'Failure',
					error,
				});
			}
		}
		default: {
			_res.setHeader('Allow', ['GET', 'PUT']);
			return _res.status(405).json({
				type: 'Failure',
				error: {
					message: `Method ${method} is Not Allowed for this API.`,
				},
			});
		}
	}
};
