import { axiosGet } from "helpers";

export const fetchAllThroughSearchQuery = async (query: string) => {
  /**
   * There are some rate limiting error, try to keep the rate of fetching as low as possible from client
   */
 try {
  const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/search/all?query=${query.replaceAll(" ", "+")}`);
  if(res !== "Failed")
   return res.data;
  return "Failed";
 }
 catch (err: any) {
  return err.message
 }
};

export const fetchSongsThroughSearchQuery = async (query: string, page : number = 1, entries = 10) => {
 try {
   const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/search/songs?query=${query.replaceAll(" ", "+")}`);
   if(res !== "Failed")
    return res.data;
   return "Failed";
 }
 catch (err: any) {
  return err.message
 }
};