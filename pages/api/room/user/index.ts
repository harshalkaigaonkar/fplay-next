// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { Session, unstable_getServerSession } from 'next-auth';
// import  "utils/connect-db"
// import Room from 'models/Room';
// import User from 'models/User';
// import { authOptions } from 'pages/api/auth/[...nextauth]';
// import {
//   MongooseRoomTypes, 
//   MongooseUserTypes, 
//   ResponseDataType,
// } from 'types';
// import { Types } from 'mongoose';

// export default async (
//   _req: NextApiRequest,
//   _res: NextApiResponse<
//     ResponseDataType<
//       MongooseRoomTypes, 
//       unknown
//     >
//   >
// ) => {

//  const {
//   method,
//   body,
//   cookies,
//   query
//  } = _req;

//  const {
//   type
//  } : Partial<{ 
//   type: "add"|"remove" 
//  }> = query;

//  const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

//  //  console.log("Cookies: ", cookies)

//  if(!session) return _res.status(401).redirect("/login")

//  switch(method) {
//   // @route     POST api/room/user?type="add"/"remove"
//   // @desc      Manipulate User to Add/Remove w.r.t Room 
//   // @access    Private
//   // @status    Works Properly(Test it, check on never type for user._id)
//   case "POST": {
//    const {
//     room_id,
//     user_id
//     }: {
//       room_id: string|Types.ObjectId,
//       user_id: any,
//     } = body;

//    try {

//     const room: (MongooseRoomTypes & {
//       _id: Types.ObjectId
//     })|null = await Room.findById(room_id);
    
//     if(!room) 
//      throw new Error("Room Not Found!!");

//     const session_user = await User.findOne({email: session.user?.email});

//     if(!session_user)
//       throw new Error("Session User Not Found!!")

//     if(session_user._id !== room.owned_by)
//       throw new Error("Session User Not Allowed to Add/Remove Anyone!!")


//     const user = await User.findById(user_id);

//     const {
//       _id
//     }: {
//       _id: never
//     } = user;

//     if(!user)
//       throw new Error("User to Add/Remove Not Found!!")

//     let updated_room: MongooseRoomTypes|null = null;

//     if(type === "add") {

//      if(room.room_access_users.includes(_id))
//       throw new Error('User Already in the Room!!');

//      room.room_access_users = [
//       ...room.room_access_users,
//       user._id
//      ];

//     }
//     else {

//      if(!room.room_access_users.includes(_id))
//       throw new Error('User is Not in the Room!!');

//      room.room_access_users = room.room_access_users.splice(room.room_access_users.indexOf(_id), 1);

//     }

//     const {
//       room_access_users
//     } = room;

//     updated_room = await Room.findByIdAndUpdate(room_id, {
//       room_access_users
//      });

//     if(!updated_room)
//      throw new Error('User Cannot be Added or Removed!!');

//     return _res.status(201).json({
//      type: "Success",
//      data: updated_room
//     });
//    } catch(error) {
//     return _res.status(500).json({
//      type:"Failure",
//      error,
//     })
//    }
//   }
//   default: {
//    _res.setHeader("Allow", ["POST"]);
// 			return _res
// 				.status(405)
// 				.json({ 
//      type: "Failure",
//      error: {
//       message: `Method ${method} is Not Allowed for this API.`
//      }
//      })
//   }
//  }
// }
