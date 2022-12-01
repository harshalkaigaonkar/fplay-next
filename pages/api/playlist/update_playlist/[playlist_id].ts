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
  query
 } = _req;

 const {
  playlist_id,
  type
 }: Partial<{
  playlist_id: string,
  type: "add"|"remove"
 }> = query

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);
//  console.log("Cookies: ", cookies)

if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     POST api/playlists/update_playlists/:playlist_id?type="add/remove"
  // @desc      Update a Playlist
  // @access    Private
  // @status    Works Properly(test it.)
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

    const playlist = await Playlist.findById(playlist_id);

    
    if(playlist)
    return _res.status(200).json({
     type: "Success",
     data: playlist
    });
    
    const user = await User.findOne({email: session.user?.email});

    if(!user) 
     throw new Error('User Not Found!!')

     const {
      _id
     } = user;

     if(playlist.owned_by !== _id)
      throw new Error('Not Permitted to Update!!');

     let update_playlist_obj: {
      name?: string,
      is_private?: boolean,
      songs?: string[],
     } = {};

     if(name)
      update_playlist_obj.name = name;
     if(is_private)
      update_playlist_obj.is_private = is_private;

     if(songs) {
      playlist.songs.forEach((song: string) => {
       if(songs.includes(song) && type === "add") {
        throw new Error(`${song} Already Present!!`)
       }
       else if (!songs.includes(song) && type === "remove") {
        throw new Error(`${song} Not Present!!`)
       }
      })
      if(type === "add")
       update_playlist_obj.songs = [
        ...songs,
        ...playlist.songs
       ]
       else if (type === "remove")
       update_playlist_obj.songs = playlist.songs
       .filter((song: string) => songs.includes(song));
     }

     const updated_playlist = await Playlist.findByIdAndUpdate(playlist_id, update_playlist_obj);


    return _res.status(201).json({
     type: "Success",
     data: updated_playlist
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
