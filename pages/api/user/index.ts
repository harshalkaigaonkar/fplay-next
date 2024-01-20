// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import 'utils/connect-db';
import User from 'models/User';
import { MongooseUserTypes } from 'types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ResponseDataType } from 'types';

export default async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<MongooseUserTypes, unknown>>,
) => {
	const { method, body, cookies, query } = _req;

	const session: Session | null = await unstable_getServerSession(
		_req,
		_res,
		authOptions,
	);
	//  console.log("Cookies: ", cookies)

	switch (method) {
		// @route     GET api/user
		// @desc      Get User By Email.
		// @access    Public (Have to make it Private)
		// @status    Works Properly
		case 'GET': {
			const { email } = query;

			try {
				if (!email) throw new Error('Email is Required!!');

				const user = await User.findOne({
					email,
				});

				if (user)
					return _res.status(200).json({
						type: 'Success',
						data: user,
					});

				throw new Error('No User Found!!');
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message.error || error.message,
				});
			}
		}
		// @route     POST api/user
		// @desc      Create a New User for Success OAuth Callback
		// @access    Public (Have to make it Private)
		// @status    Works Properly
		case 'POST': {
			const { profile } = body;

			const { name, picture, given_name, family_name, email } = profile;

			try {
				if (!profile) throw new Error('Not an Success OAuth Callback!!');

				const user = await User.findOne({
					email,
				});

				if (user)
					return _res.status(200).json({
						type: 'Success',
						data: user,
					});

				const newUser: HydratedDocument<MongooseUserTypes> = new User({
					name,
					username:
						'@' +
						(
							given_name +
							family_name +
							Math.floor(Math.random() * 50)
						).toLowerCase(),
					email,
					profile_pic: picture,
				});
				await newUser.save();
				return _res.status(201).json({
					type: 'Success',
					data: newUser,
				});
			} catch (error: any) {
				return _res.status(500).json({
					type: 'Failure',
					error: error.message.error || error.message,
				});
			}
		}
		default: {
			_res.setHeader('Allow', ['GET', 'POST']);
			return _res.status(405).json({
				type: 'Failure',
				error: {
					message: `Method ${method} is Not Allowed for this API.`,
				},
			});
		}
	}
};
