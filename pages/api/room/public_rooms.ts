// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SortOrder } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import Room from '../../../models/Room';
import { authOptions } from '../auth/[...nextauth]';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<any>
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

   const {active, sort_by, search_query, page = 1, limit = 10}: any = body;
   
   try {

   const find_condition: {
    is_private: boolean,
    active?: boolean
   } = {
    is_private: false,
   }

   const total_results: number = await Room.find(find_condition).count();
   
   let skip_entries: number = 0;

   if(page > 1 && total_results && Math.ceil(total_results/limit) > page) {
    skip_entries = limit * (page-1);
   }

   if(typeof active === 'boolean')
   find_condition.active = active;
   
   const sort_condition: {
    createdAt?: SortOrder,
    upvotes?: SortOrder
   } = {};
   
   // filters

   switch(sort_by) {
    case "date:asc": {
     sort_condition.createdAt = 'asc';
     break;
    }
    case "date:dsc": {
     sort_condition.createdAt = 'desc';
     break;
    }
    case "upvotes:asc": {
     sort_condition.upvotes = 'asc';
     break;
    }
    case "upvotes:dsc": {
     sort_condition.upvotes = 'desc';
     break;
    }
    default : {
    }
   }
    
    const rooms = 
     await Room
     .find(find_condition)
     .sort(sort_condition)
     .skip(skip_entries)
     .limit(limit);

    return _res.status(200).json({
     type: "Success",
     data: {
      rooms,
      entries: limit,
      total_results,
      page
     }
    })
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
