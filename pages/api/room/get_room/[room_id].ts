// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth';
import  "utils/connect-db";
import Room from 'models/Room';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { 
  MongooseRoomTypes, 
  ResponseDataType 
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

 const session = await unstable_getServerSession(_req, _res, authOptions);
  //  console.log("Cookies: ", cookies)
  if(!session) return _res.status(401).redirect("/login")

 switch(method) {
  // @route     GET api/room/get_room/:room_id
  // @desc      Get a Room's Detail
  // @access    Private
  // @status    Works Properly
  case "GET": {
   
   const {
    room_id
   }: Partial<{
    room_id: string
   }> = query;
   
   try {
    
    const data = 
     await Room
     .findById(room_id)

     if(!data)
      throw new Error("No Room Found!!")
      
     const populate_array: string[] = [];
     
     if(data.owned_by)
     populate_array.push("owned_by");
     if(data.upvotes && data.upvotes.length > 0)
     populate_array.push("upvotes");
     if(data.genres && data.genres.length > 0)
     populate_array.push("genres");

    await data.populate(populate_array.join(" ")); // check this
    

    return _res.status(200).json({
     type: "Success",
     data
    });
  } catch(error:any) {
    return _res.status(500).json({
     type:"Failure",
     error:error.message.error || error.message,
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
