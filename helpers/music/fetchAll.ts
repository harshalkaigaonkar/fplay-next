import { axiosGet } from "helpers";

export const fetchAllThroughSearchQuery = async (query: string) => {
 /**
  * There are some rate limiting error, try to keep the rate of fetching as low as possible from client
  */
try {
  console.log(`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/search/all?query=${query.replaceAll(" ", "+")}`)
 const res = await axiosGet(`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/search/all?query=${query.replaceAll(" ", "+")}`);
 if(res !== "Failed")
  return res.data;
 return "Failed";
}
catch (err: any) {
 return err.message
}
};