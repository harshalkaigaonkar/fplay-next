// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument, SortOrder } from 'mongoose';
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { Session, unstable_getServerSession } from 'next-auth';
// import  "utils/connect-db"
// import Room from 'models/Room';
// import User from 'models/User';
// import {
//   MongooseRoomTypes,
//   MongooseUserTypes,
//   ResponseDataType,
// } from 'types';
// import { authOptions } from 'pages/api/auth/[...nextauth]';
// import axios from 'axios';

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
//   user_id
//  } = query;

//  const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

//  //  console.log("Cookies: ", cookies)

//  if(!session) return _res.status(401).redirect("/login")

//  switch(method) {
//   // @route     POST api/room/user/transfer_ownership
//   // @desc      Transfer Ownership of Room to Different User
//   // @access    Private (User who Owns Rooms Can only Transfer)
//   // @status    Works Properly
//   case "PUT": {
//    const {
//     room_id
//     } = body;

//    try {

//     const room =
//     await Room
//      .findById(room_id)
//      .populate('owned_by');

//     if(!room)
//      throw new Error("Room Not Found!!");

//     const user: MongooseUserTypes|null =
//     await User
//      .findById(user_id);

//     if(!user)
//      throw new Error('No User Found For Tranfering OwnerShip!!');

//     const {
//       owned_by
//     } = room;

//     if(owned_by.email !== session.user?.email)
//      throw new Error('Room is Not Owned by the Session User!!');

//     const updated_room = await Room.findByIdAndUpdate(room_id, {
//      owned_by: room_id
//     });

//     if(!updated_room)
//      throw new Error('Ownership Not Transferred!!');

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
//    _res.setHeader("Allow", ["PUT"]);
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
