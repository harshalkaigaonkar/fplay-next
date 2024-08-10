// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import 'utils/connect-db';
import { ResponseDataType } from 'types';

const SocketAPI = async (
	_req: NextApiRequest,
	_res: NextApiResponse<ResponseDataType<any, any>>,
) => {
	const { method } = _req;

	switch (method) {
		// @route     GET api/socket
		// @desc      Create/ReInitialize Socket conenction with server to client
		// @access    Public (want it to be private)
		// @status    DEV
		case 'GET': {
			try {
				return _res.status(201).json({
					type: 'Success',
					data: 'Socket connected successfully.',
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

export default SocketAPI;
