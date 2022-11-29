// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db";
import Room from 'models/Room';
import Song from 'models/Song';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import {
  MongooseRoomTypes, 
  MongooseSongTypes, 
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
  // @route     POST api/room/songs?type="pin"/"unpin"
  // @desc      Pin/Unpin Songs to the Room
  // @access    Private
  // @status    Works Properly
  case "PUT": {
   const {
    room_id,
    song_id
    } = body;

   try {

    const room: MongooseRoomTypes|null = await Room.findById(room_id);
    
    if(!room) 
     throw new Error("Room Not Found!!");
    
    const {
      pinned_songs
    } = room;

    const song: MongooseSongTypes|null = await Song.findById(song_id);

    if(!song)
     throw new Error("Songs Not Found!!")

    let updated_room: MongooseRoomTypes|null = null;

    if(type === "pin") {

     if(pinned_songs.includes(song_id))
      throw new Error('Song Already Pinned to the Room!!');

     pinned_songs.push(song_id);

    }
    else if (type === 'unpin') {

     if(!pinned_songs.includes(song_id))
      throw new Error('Song is Not Pinned to the Room!!');

     room.pinned_songs = pinned_songs.splice(pinned_songs.indexOf(song_id), 1);

    }
    else {
     throw new Error("Other Types are Not Allowed!!");
    }

    updated_room = await Room.findByIdAndUpdate(room_id, {
     pinned_songs,
    });

    if(!updated_room)
      throw new Error("Song Cannot Be Pinned to the Room!!")

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
