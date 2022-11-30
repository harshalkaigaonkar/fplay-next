// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db";
import User from 'models/User';
import { MongoosePlaylistTypes, MongooseUserTypes, ResponseDataType, SaavnSongObjectTypes } from 'types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import Playlist from 'models/Playlist';
import axios from 'axios';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<ResponseDataType<MongoosePlaylistTypes, unknown>>
) => {

 const {
  method,
  query,
  cookies,
  body
 } = _req;

 const {
  playlist_id,
} = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

//  console.log("Cookies: ", cookies)

if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     GET api/playlists/:playlist_id
  // @desc      Get Playlists's Info from Database
  // @access    Private
  // @status    Works Properly
  case "GET": {
   
   try {
    const playlist = await Playlist
      .findById(playlist_id);

    const song_ids: string = playlist.songs.join(",");

    const res = await axios
    .get<{
      type: string, 
      results: SaavnSongObjectTypes[]
    }>(`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/songs?id=${song_ids}`);

    if(!res.data)
     throw new Error("Error While fetching Songs Info!!")

    const {
      results: songs
    } = res.data;

    playlist.songs = songs;
    
    if(playlist)
     return _res.status(200).json({
      type: "Success",
      data: playlist
     });

    throw new Error("No User Found !!");

   } catch (error) {
    return _res.status(500).json({
     type:"Failure",
     error,
    })
   }
  }
  // @route     PUT api/playlists/:playlist_id
  // @desc      Update Playlists's Info (Name, owned_by)
  // @access    Private
  // @status    Works Properly
  case "PUT": {
    const {
      name,
      to_own
    }: {
     name?: string,
     to_own?: string,
    } = body;
    
    /**
     * selected to Options for Updation 
     * only these body props are allowed
     */

    const update_playlist_obj: {
     owned_by?: string;
     name?: string,
    } = {};

    if(name) 
      update_playlist_obj.name = name;
    if(to_own) 
      update_playlist_obj.owned_by = to_own;
    
    try {
    
      const user= 
      await User.findById(to_own);

    if(!user)
      throw new Error("No User Found to Transfer Playlist!!")


    const updated_playlist = await Playlist.findByIdAndUpdate(playlist_id, update_playlist_obj);
    return _res.status(204).json({
      type: "Success",
      data: updated_playlist
    })
  } catch(error) {
    return _res.status(500).json({
     type:"Failure",
     error,
    })
   }
  }
  default: {
   _res.setHeader("Allow", ["GET", "PUT"]);
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
