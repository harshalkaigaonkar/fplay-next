// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth';
import  "utils/connect-db"
import User from '../../../models/User';
import { authOptions } from '../auth/[...nextauth]';

export default async (
  _req: NextApiRequest,
  _res: NextApiResponse<any>
) => {

 const {
  method,
  query,
  cookies,
  body
 } = _req;
 const {id} = query;

 const session: Session|null = await unstable_getServerSession(_req, _res, authOptions);

 console.log("Cookies: ", cookies)

 switch(method) {
  // @route     GET api/user/:id
  // @desc      Get User's Info from Database
  // @access    Private
  // @status    Works Properly
  case "GET": {
   if(!session) return _res.status(401).redirect("/login")
   try {
    const user = await User.findById(id) || await User.findOne({email: session.user?.email});
    if(user) {
     return _res.status(200).json({
      type: "Success",
      data: user
     })
    }
    throw new Error("No User Found !!")
   } catch (error) {
    return _res.status(500).json({
     type:"Failure",
     error,
    })
   }
  }
  // @route     PUT api/user/:id
  // @desc      Update User's Info (Name, username, email)
  // @access    Private
  // @status    Works Properly
  case "PUT": {
    const {update_profile} = body;
    // selected to Options for Updation 
    // only these body props are allowed
    const {
      name, 
      username, 
      email, 
      ...rest
    } = update_profile;

    const update_profile_obj: {
      name?: string,
      username?: string,
      email?: string
    } = {};

    if(name) update_profile_obj.name = name;
    if(email) update_profile_obj.email = email;
    if(username) update_profile_obj.username = username;
    
    try {

    const user = await User.findById(id);
    if(!user)
    throw new Error("No User Found to Update Details!!")

    const updated_user = await User.findByIdAndUpdate(id, update_profile_obj);
    return _res.status(204).json({
      type: "Success",
      data: updated_user
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
