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
import axios from 'axios';

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
  type,
  name
 } : Partial<{ 
  type: "add"|"remove",
  name: string
 }> = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     POST api/room/genre?name="string"&type="add"/"remove"
  // @desc      Manipulate Genres to Add/Remove w.r.t Room 
  // @access    Private
  // @status    Works Properly
  case "PUT": {
   const {
    room_id
    }: {
     room_id: string,
    } = body;

   try {

    const room: MongooseRoomTypes|null = await Room.findById(room_id);
    
    if(!room) 
     throw new Error("Room Not Found!!");

    let genre: MongooseGenreTypes|null = await Genre.findOne({
     type: name
    });

    if(!genre) {
     const {data} = await axios
      .post<MongooseGenreTypes>(
       `${process.env.NEXTAUTH_URL}/api/genre?type=${name}`
       );
     
     if(!data)
     throw new Error("Genre Cannot be Added!!")
     
     genre = data;
    }

    let updated_room: MongooseRoomTypes|null = null;

    if(type === "add") {

     if(room.genres.includes(genre._id))
      throw new Error('Genre Already Attached to the Room!!');

     room.genres = [
      ...room.genres,
      genre._id,
     ];

    }
    else if (type === 'remove') {

     if(!room.genres.includes(genre._id))
      throw new Error('Genre is Not Attached to the Room!!');

     room.genres = room.genres.splice(room.genres.indexOf(genre._id), 1);

    }
    else {
     throw new Error("Other Types are Not Allowed!!");
    }

    updated_room = await Room.findByIdAndUpdate(room_id, {
     genres: room.genres,
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
