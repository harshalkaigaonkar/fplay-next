// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import  "utils/connect-db";
import Room from 'models/Room';
import { 
  FindRoomsCondition as FindPlaylistCondition, 
  GetBodyMoreThanOne, 
  MongoosePlaylistTypes, 
  MongooseRoomTypes, 
  ResponseDataType, 
  SortRoomsConditionType, 
  SuccessRoomsReponse 
} from 'types';
import Playlist from 'models/Playlist';


 export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<
    ResponseDataType<
      SuccessRoomsReponse<MongoosePlaylistTypes>, 
      unknown
      >
    >
) => {

 const {
  method,
  body,
 } = _req;

 switch(method) {
  // @route     GET api/playlist/public_playlists
  // @desc      Get All Public PLaylists According to various Filters
  // @access    Public
  // @status    Works Properly with filter and pagination
  // @left      search Query
  case "GET": {

   const {
    sort_by, 
    owned_by,
    search_query, 
    page = 1, 
    limit = 10
  }: GetBodyMoreThanOne = body;
   
   try {

   const find_condition: FindPlaylistCondition = {
    is_private: false,
   }

   const total_entries: number = await Playlist.find<FindPlaylistCondition>(find_condition).count();
   
   let skip_entries: number = 0;

   if (
    page > 1 && 
    total_entries && 
    Math.ceil(total_entries/limit) > page
  ) {
    skip_entries = limit * (page-1);
   }
   
   const sort_condition: SortRoomsConditionType = {};
   
   /**
    * Sorting Filters
    */

   switch(sort_by) {
    case "date:asc": {
     sort_condition.createdAt = 'asc';
     break;
    }
    case "date:desc": {
     sort_condition.createdAt = 'desc';
     break;
    }
    // case "upvotes:asc": {
    //  sort_condition.upvotes = 'asc';
    //  break;
    // }
    // case "upvotes:desc": {
    //  sort_condition.upvotes = 'desc';
    //  break;
    // }
    default : {
    }
   }

   if(owned_by)
    find_condition.owned_by = owned_by;
    
    const playlists: MongoosePlaylistTypes[] = 
     await Playlist
     .find(find_condition)
     .sort(sort_condition)
     .skip(skip_entries)
     .limit(limit);

     const data: SuccessRoomsReponse<MongoosePlaylistTypes> = {
      playlists,
      limit,
      total_entries,
      page
     };

    return _res.status(200).json({
     type: "Success",
     data
    });
   } catch(error) {
    return _res.status(500).json({
     type:"Failure",
     error,
    })
   }
  }
  default: {
   _res.setHeader("Allow", ["GET"]);
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
