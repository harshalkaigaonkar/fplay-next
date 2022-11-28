// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument, SortOrder } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import Room from '../../../models/Room';
import User from '../../../models/User';
import { MongooseRoomTypes } from '../../../types';
import { authOptions } from '../auth/[...nextauth]';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<any>
) => {

 const {
  method,
  body,
  cookies,
  query,
 } = _req;

 const {user_id, room_id} = query;

 const session = await unstable_getServerSession(_req, _res, authOptions);
 console.log("Cookies: ", cookies)

 switch(method) {
  // @route     GET api/room/:user_id
  // @desc      Get All Private Rooms for the session user
  // @access    Private
  // @status    Works Properly with filter and pagination
  // @left      search Query
  case "GET": {
    if(!session) return _res.status(401).redirect("/login")
    const {active, sort_by, search_query, page = 1, limit = 10}: any = body;
    
    try {
 
    const find_condition: {
     is_private: boolean,
     room_access_users: string[],
     active?: boolean
    } = {
     is_private: true,
     room_access_users: [`${user_id}`]
    }
 
    const total_results: number = await Room.find(find_condition).count();
    
    let skip_entries: number = 0;
 
    if(page > 1 && total_results && Math.ceil(total_results/limit) > page) {
     skip_entries = limit * (page-1);
    }
 
    if(typeof active === 'boolean')
    find_condition.active = active;
    
    const sort_condition: {
     createdAt?: SortOrder,
     upvotes?: SortOrder
    } = {};
    
    // filters
 
    switch(sort_by) {
     case "date:asc": {
      sort_condition.createdAt = 'asc';
      break;
     }
     case "date:dsc": {
      sort_condition.createdAt = 'desc';
      break;
     }
     case "upvotes:asc": {
      sort_condition.upvotes = 'asc';
      break;
     }
     case "upvotes:dsc": {
      sort_condition.upvotes = 'desc';
      break;
     }
     default : {
     }
    }
     
     const rooms = 
      await Room
      .find(find_condition)
      .sort(sort_condition)
      .skip(skip_entries)
      .limit(limit);
 
     return _res.status(200).json({
      type: "Success",
      data: {
       rooms,
       entries: limit,
       total_results,
       page
      }
     })
    } catch(error) {
     return _res.status(500).json({
      type:"Failure",
      error,
     })
    }
   }
  // @route     POST api/room/:user_id
  // @desc      Create a New Room for Session User
  // @access    Private
  // @status    Works Properly
  case "POST": {
    if(!session) return _res.status(401).redirect("/login")
   const {room} = body;
   // room database object with options
   const {
    name,
    desc,
    active,
    genres,
    is_private,
    room_access_users,
    owned_by, // would be from session's User ID.
    // later use of owned_by is for Groups
    session_history, // would be empty initially
    pinned_playlists,
    pinned_songs,
    upvotes, // would be empty array initially
   } = room;
   try {
    if(!name) 
    throw new Error("Name For Room is Required !!");

    const user = await User.findById(user_id);
    
    if(!user) 
     throw new Error("User Not Found!!");
    
    const {_id} = user;
    const room = await Room.findOne({name})
    if(room) {
      throw new Error("Room Already Exists!!");
    }
    const newRoom: HydratedDocument<MongooseRoomTypes> = new Room({
     name,
     desc: desc || "",
     active: active || false,
     genres: genres || [],
     is_private: is_private || false,
     room_access_users: room_access_users || [] ,
     owned_by: _id,
     session_history: [],
     pinned_playlists: pinned_playlists || [],
     pinned_songs: pinned_songs || [],
     upvotes: []
    })
    await newRoom.save();
    return _res.status(201).json({
     type: "Success",
     data: newRoom
    })
   } catch(error) {
    return _res.status(500).json({
     type:"Failure",
     error,
    })
   }
  }
  default: {
   _res.setHeader("Allow", ["GET", "POST"]);
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
