import { Types } from "mongoose";
import { MongooseRoomTypes } from "../types";
import Room from "../models/Room";
import { NextApiRequest, NextApiResponse } from "next";

export const get_public_rooms = async (req: NextApiRequest, res: NextApiResponse) => {
 const {body} = req;
 const {sort_by, search_query, limit = 10} = body;

 // filter

 switch(sort_by) {
  case "date:asc": {
   break;
  }
  case "date:dsc": {
   break;
  }
  case "upvotes:asc": {
   break;
  }
  case "upvotes:dsc": {
   break;
  }
  case "active:true": {
   break;
  }
  case "active:false": {
   break;
  }
  default : {

  }
 }

 try {

  let rooms: (MongooseRoomTypes & {
   _id: Types.ObjectId
  })[] = await Room.find({
   private: false,
  })

  res.status(200).json({
   type: "Success",
   data: rooms
  })
  
 } catch (error: any) {
  
  console.error(error);

  res.status(500).json({
   type: "Failure",
   error: error.message,
  })
 }
}

export const get_private_rooms = async () => {

}

export const create_room = async (req: Request, res: Response) => {
 const room = {
  name: "Room1",
  active: true,
  genres: [],
  private: true,
  owned_by: '637f27ce7dc20ba1c44f640f',
  pinned_playlists: [],
  pinned_songs: [],
  upvotes: [],
  session_history: [],
 }

 let room_db = new Room(room);
 await room_db.save();

}
export const update_room = async () => {

}
export const pin_playlist = async () => {

}
export const unpin_playlist = async () => {

}
export const pin_song = async () => {

}
export const unpin_song = async () => {

}
export const transfer_ownership = async () => {

}