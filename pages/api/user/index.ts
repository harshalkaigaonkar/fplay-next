// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import User from '../../../models/User';
import { authOptions } from '../auth/[...nextauth]';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<any>
) => {

 const {
  method,
  body,
  cookies
 } = _req;

 const session = await unstable_getServerSession(_req, _res, authOptions);
//  console.log("Cookies: ", cookies)

 switch(method) {
  // @route     POST api/user
  // @desc      Create a New User for Success OAuth Callback
  // @access    Public (Have to make it Private)
  // @status    Works Properly
  case "POST": {
   const {profile} = body;
   try {
    const user = await User.findOne({email: profile.email});
    if(user) {
     return _res.status(200).json({
      type: "Success",
      data: user
     })
    }
    const newUser = new User({
     name: profile.name,
     username: (profile.given_name + "_" + profile.family_name).toLowerCase(),
     email: profile.email,
     profile_pic: profile.picture,
     playlists: [],
     rooms_on: [],
    })
    await newUser.save();
    return _res.status(201).json({
     type: "Success",
     data: newUser
    })
   } catch(error) {
    return _res.status(500).json({
     type:"Failure",
     error,
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
