// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import  "utils/connect-db";
import Room from 'models/Room';
import { 
  FindRoomsCondition, 
  GetRoomsBody, 
  MongooseRoomTypes, 
  ResponseDataType, 
  SortRoomsConditionType, 
  SuccessRoomsReponse 
} from 'types';


 export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<
    ResponseDataType<
      SuccessRoomsReponse, 
      unknown
      >
    >
) => {

 const {
  method,
  body,
 } = _req;

 switch(method) {
  // @route     GET api/room/public_rooms
  // @desc      Get All Public Rooms According to various Filters
  // @access    Public
  // @status    Works Properly with filter and pagination
  // @left      search Query
  case "GET": {

   const {
    active, 
    sort_by, 
    search_query, 
    page = 1, 
    limit = 10
  }: GetRoomsBody = body;
   
   try {

   const find_condition: FindRoomsCondition = {
    is_private: false,
   }

   const total_entries: number = await Room.find<FindRoomsCondition|any>(find_condition).count();
   
   let skip_entries: number = 0;

   if (
    page > 1 && 
    total_entries && 
    Math.ceil(total_entries/limit) > page
  ) {
    skip_entries = limit * (page-1);
   }

   if(typeof active === 'boolean')
   find_condition.active = active;
   
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
    case "upvotes:asc": {
     sort_condition.upvotes = 'asc';
     break;
    }
    case "upvotes:desc": {
     sort_condition.upvotes = 'desc';
     break;
    }
    default : {
    }
   }
    
    const rooms: MongooseRoomTypes[] = 
     await Room
     .find(find_condition)
     .sort(sort_condition)
     .skip(skip_entries)
     .limit(limit);

     const data: SuccessRoomsReponse = {
      rooms,
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
