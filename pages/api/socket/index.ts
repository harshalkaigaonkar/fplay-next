// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import  "utils/connect-db"
import {
  ResponseDataType, 
} from 'types';
import socketManager from 'socket';
import redisManager, { client } from 'cache';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<
    ResponseDataType<any, any>
  >
) => {

 const {
  method,
 } = _req;

 switch(method) {
  // @route     GET api/socket
  // @desc      Create a New Room for Session User
  // @access    Private
  // @status    Works Properly
  case "GET": {
   try {
    await redisManager();
    await socketManager(_res);
    return _res.status(201).json({
     type: "Success",
     data: "Socket connected successfully."
    });
  } catch(error:any) {
    return _res.status(500).json({
     type:"Failure",
     error:error.message.error || error.message,
    })
   }
  }
  default: {
   _res.setHeader("Allow", ["POST"]);
    return _res
      .status(405)
      .json({ 
        type: "Failure",
        error: {
        message: `Method ${method} is Not Allowed for this API.`
        }
        })
      }
 }
}
