// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import Genre from 'models/Genre';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { HydratedDocument } from 'mongoose';
import {
 MongooseGenreTypes,
  ResponseDataType,
} from 'types';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<
    ResponseDataType<
      MongooseGenreTypes, 
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
  type: string,
 }> = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     POST api/genre?type=string
  // @desc      Adds/returns Genres 
  // @access    Private
  // @status    Works Properly
  case "POST": {

   try {

    const genre: MongooseGenreTypes|null = await Genre.findOne({type});
    
    if(genre)
    return _res
     .status(200)
     .json({
      type: "Success",
      data: genre
     })

     let new_genre: HydratedDocument<MongooseGenreTypes> = new Genre ({
      type
     });
     
     await new_genre.save();

    return _res.status(201).json({
     type: "Success",
     data: new_genre
    });
   } catch(error:any) {
    return _res.status(500).json({
     type:"Failure",
     error:error.message.error || error.message,
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
