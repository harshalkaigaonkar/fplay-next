// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import Room from 'models/Room';
import Playlist from 'models/Playlist';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import {
  MongoosePlaylistTypes,
  MongooseRoomTypes, 
  MongooseUserTypes, 
  ResponseDataType,
} from 'types';
import User from 'models/User';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<
    ResponseDataType<
      MongooseRoomTypes, 
      unknown
    >
  >
) => {

 const {
  method,
  body,
  cookies,
  query
 } = _req;

 const {
  type
 } : Partial<{ 
  type?: "pin"|"unpin",
 }> = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     GET api/room/library
  // @desc      Get User's Library
  // @access    Private
  // @status    Works Properly
  case "GET": {
   try {

    const user: MongooseUserTypes|null = await User.findOne({email: session.user?.email});
    
    if(!user) 
     throw new Error("User Not Found!!");
    
    

    // return _res.status(200).json({
    //  type: "Success",
    //  data,
    // });
   } catch(error) {
    return _res.status(500).json({
     type:"Failure",
     error,
    })
   }
  }
  default: {
   _res.setHeader("Allow", ["GET"]);
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
