// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument, SortOrder } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import Room from 'models/Room';
import User from 'models/User';
import {
  MongooseRoomTypes, 
  MongooseUserTypes, 
  ResponseDataType,
} from 'types';
import { authOptions } from 'pages/api/auth/[...nextauth]';

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
 } : Partial<{ type: "add"|"remove" }> = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     POST api/room/user?type="add"/"remove"
  // @desc      Manipulate User to Add/Remove w.r.t Room 
  // @access    Private
  // @status    Works Properly
  case "POST": {
   const {
    room_id
    } = body;

   try {

    const room: MongooseRoomTypes|null = await Room.findById(room_id);
    
    if(!room) 
     throw new Error("Room Not Found!!");
    
    const {
      room_access_users
    } = room;

    const user: MongooseUserTypes|null = await User.findOne({email: session.user?.email});

    let updated_room: MongooseRoomTypes|null = null;

    if(type === "add") {

     if(room_access_users.includes(room_id))
      throw new Error('User Already in the Room!!');

     room_access_users.push(room_id);

     updated_room = await Room.findByIdAndUpdate(room_id, {
      room_access_users,
     });

     if(!updated_room)
      throw new Error("User Cannot Be Added in the Room!!")

    }
    else if (type === 'remove') {

     if(!room_access_users.includes(room_id))
      throw new Error('User is Not in the Room!!');

     room.room_access_users = room_access_users.splice(room_access_users.indexOf(room_id), 1);

     updated_room = await Room.findByIdAndUpdate(room_id, {
      room_access_users
     });

     if(!updated_room)
      throw new Error("User Cannot Be Added in the Room!!")
    }
    else {
     throw new Error("Other Types are Not Allowed!!");
    }

    if(!updated_room)
     throw new Error('User Cannot be Added or Removed!!');

    return _res.status(201).json({
     type: "Success",
     data: updated_room
    });
   } catch(error) {
    return _res.status(500).json({
     type:"Failure",
     error,
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
