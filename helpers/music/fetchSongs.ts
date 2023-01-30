import { axiosGet } from "helpers";

export const fetchAllThroughSearchQuery = async (query: string) => {
 try {
  const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/search/all?query=${query.replaceAll(" ", "+")}`);
  console.log(res.results)
  if(res !== "Failed")
   return res.results;
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
    return res.results;
   return "Failed";
 }
 catch (err: any) {
  return err.message
 }
};