// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HydratedDocument } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db";
import User from 'models/User';
import { MongoosePlaylistTypes, MongooseUserTypes } from 'types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ResponseDataType } from 'types';
import Playlist from 'models/Playlist';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<ResponseDataType<MongoosePlaylistTypes, unknown>>
) => {

 const {
  method,
  body,
  cookies,
 } = _req;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);
//  console.log("Cookies: ", cookies)

if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     POST api/playlists
  // @desc      Create a New Playlist
  // @access    Private
  // @status    Works Properly
  case "POST": {

   const { 
    name,
    songs,
    is_private
    }: {
     name?: string,
     songs?: string[] // Saavn Ids,
     is_private?: boolean
    } = body;

   try {

    const playlist = await Playlist.findOne({
      name
    });

    
    if(playlist)
    return _res.status(200).json({
     type: "Success",
     data: playlist
    });
    
    const user = await User.findOne({email: session.user?.email})

    if(!user) 
     throw new Error('User Not Found!!')

     const {
      _id
     } = user;

    const newPlaylist: HydratedDocument<MongoosePlaylistTypes> = new Playlist({
     name,
     owned_by: _id,
     is_private: is_private || false,
     songs: songs || []
    });
    await newPlaylist.save();
    return _res.status(201).json({
     type: "Success",
     data: newPlaylist
    });
   } catch(error: unknown) {
    return _res.status(500).json({
     type:"Failure",
     error,
    });
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
        });
  }
 }
}
