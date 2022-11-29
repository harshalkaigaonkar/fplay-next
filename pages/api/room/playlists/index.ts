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
  ResponseDataType,
} from 'types';

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
  type: "pin"|"unpin",
 }> = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     POST api/room/playlists?type="pin"/"unpin"
  // @desc      Pin/Unpin Playlists to the Room
  // @access    Private
  // @status    Works Properly
  case "PUT": {
   const {
    room_id,
    playlist_id
    } = body;

   try {

    const room: MongooseRoomTypes|null = await Room.findById(room_id);
    
    if(!room) 
     throw new Error("Room Not Found!!");
    
    const {
      pinned_playlists
    } = room;

    const playlist: MongoosePlaylistTypes|null = await Playlist.findById(playlist_id);

    if(!playlist)
     throw new Error("Playlists Not Found!!")

    let updated_room: MongooseRoomTypes|null = null;

    if(type === "pin") {

     if(pinned_playlists.includes(playlist_id))
      throw new Error('Playlist Already Pinned to the Room!!');

     pinned_playlists.push(playlist_id);

    }
    else if (type === 'unpin') {

     if(!pinned_playlists.includes(playlist_id))
      throw new Error('Playlist is Not Pinned to the Room!!');

     room.pinned_playlists = pinned_playlists.splice(pinned_playlists.indexOf(playlist_id), 1);

    }
    else {
     throw new Error("Other Types are Not Allowed!!");
    }

    updated_room = await Room.findByIdAndUpdate(room_id, {
     pinned_playlists,
    });

    if(!updated_room)
      throw new Error("Playlist Cannot Be Pinned to the Room!!")

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
   _res.setHeader("Allow", ["PUT"]);
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
