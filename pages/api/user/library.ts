// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import { authOptions } from 'pages/api/auth/[...nextauth]';
import {
  MongoosePlaylistTypes,
  MongooseRoomTypes, 
  MongooseUserTypes, 
  ResponseDataType,
  SaavnSongObjectTypes,
  UserLibraryType,
} from 'types';
import User from 'models/User';
import axios from 'axios';
import { Types } from 'mongoose';

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

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     GET api/user/library
  // @desc      Get User's Library
  // @access    Private
  // @status    Works Properly
  case "GET": {
    try {

    const user = await User
      .findOne({
        email: session.user?.email
      })

    if(!user) 
      throw new Error("User Not Found!!");

    if(user.library.length > 0 && user.library.find((lib: UserLibraryType) => lib.type === "Playlist"))
      await user.populate("library.playlist");
      
    console.log("User: \n Check Once due to parsing of null p_ids", user)
    
     const song_ids: string = user
     .library
     .map((media: UserLibraryType) => {
      if(media.type === "Song")
        return media.song;
     }).join(",");

    if(song_ids === "")
    return _res.status(200).json({
      type: "Success",
      data: user.library,
     });

    const {data} = await axios
    .get<{
      status: string, 
      results?: SaavnSongObjectTypes[],
      message?: string
    }>(`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/songs?id=${song_ids}`);

    if(!data)
     throw new Error("Error While fetching Songs Info!!")

    if(data.status === "FAILED")
      throw new Error(`${data.message}`);      


    const {
      results: songs
    } = data;

    if(!songs)
      throw new Error("No Songs Found!!")


    user.library = user.library.map((media: UserLibraryType) => {
      if(media.type === "Song") {
        media.song = songs[0];
        songs.splice(0, 1);
        return media;
      }
    })
    
    return _res.status(200).json({
     type: "Success",
     data: user.library,
    });
  } catch(error:any) {
    return _res.status(500).json({
     type:"Failure",
     error:error.message.error || error.message,
    })
   }
  }
  // @route     POST api/room/library?type="add"|"remove"
  // @desc      Add to/Remove From User's Library
  // @access    Private
  // @Left    Check for Song Id to be in Saavn's DB 
  case "POST": {

    const {
      type
    } : Partial<{ 
      type?: "add"|"remove",
    }> = query;

    // For Addition/Deletion, both type and song|playlist is required 
    const  {
      type: media_type,
      song, // jiosaavn song Id
      playlist
    }: UserLibraryType = body;

    if(!type && !media_type && !song && !playlist)
      throw new Error("Parameter and Body Not Proper!!")

    const library = media_type === "Song" ? {
      type: media_type,
      song
    } : {
      type: media_type,
      playlist
    }

    // if(media_type === "Song") {
    //   console.log(`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/songs?id=${song}`)
    //   const {status, data} = await axios.get(`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/songs?id=${song}`);
    //   console.log(status, data)
    // }

    try {
 
     const user = await User
       .findOne({
         email: session.user?.email
       })
     
     if(!user) 
      throw new Error("User Not Found!!");
 
     if(type === 'add') {
      if(user.library.find((lib: (UserLibraryType & {
        _id: Types.ObjectId
      })) => media_type === "Song" ? lib.song === song : lib.playlist?.toString() === playlist?.toString()))
        throw new Error("Song/Playlist Already Added!!")

      user
      .library = [
        library,
        ...user.library
       ]
     } else {
      if(!user.library.find((lib: (UserLibraryType & {
        _id: Types.ObjectId
      })) => media_type === "Song" ? lib.song === song : lib.playlist?.toString() === playlist?.toString()))
        throw new Error("Song/Playlist Not Found to Remove!!")

      user
      .library 
      .splice(
        user.library
        .findIndex(
          (lib: UserLibraryType) => 
          library.type === "Song" ? 
            lib.song === library.song : 
            lib.playlist === library.playlist
        ), 1);
     }

     const updated_user = await User.findByIdAndUpdate(user._id, { $set: {
      library: user.library
     } }, {new: true, select: "library"});
     
     if(!updated_user)
      throw new Error("User's Library was not Updated!!")

     return _res.status(200).json({
      type: "Success",
      data: updated_user.library,
     });
    } catch(error:any) {
      return _res.status(500).json({
       type:"Failure",
       error:error.message.error || error.message,
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
