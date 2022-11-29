// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import Room from 'models/Room';
import Genre from 'models/Genre';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import {
 MongooseGenreTypes,
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
  type: "add"|"remove",
 }> = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     POST api/room/genre?type="add"/"remove"
  // @desc      Manipulate Genres to Add/Remove w.r.t Room 
  // @access    Private
  // @status    Works Properly
  case "PUT": {
   const {
    room_id,
    genre_id
    } = body;

   try {

    const room: MongooseRoomTypes|null = await Room.findById(room_id);
    
    if(!room) 
     throw new Error("Room Not Found!!");
    
    const {
      genres
    } = room;

    const genre: MongooseGenreTypes|null = await Genre.findById(genre_id);

    if(!genre)
    throw new Error("Genre Not Found!!")

    let updated_room: MongooseRoomTypes|null = null;

    if(type === "add") {

     if(genres.includes(genre_id))
      throw new Error('Genre Already Attached to the Room!!');

     genres.push(genre_id);

    }
    else if (type === 'remove') {

     if(!genres.includes(genre_id))
      throw new Error('Genre is Not Attached to the Room!!');

     room.genres = genres.splice(genres.indexOf(genre_id), 1);

    }
    else {
     throw new Error("Other Types are Not Allowed!!");
    }

    updated_room = await Room.findByIdAndUpdate(room_id, {
     genres,
    });

    if(!updated_room)
      throw new Error("Genre Cannot Be Atached to the Room!!")

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
