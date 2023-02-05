import { axiosGet } from "helpers";

export const fetchAlbumsThroughSearchQuery = async (query: string, page : number = 1, entries: number = 20 ) => {
 try {
   const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/search/albums?query=${query.replaceAll(" ", "+")}`);
   if(res !== "Failed")
    return res.data;
   return "Failed";
 }
 catch (err: any) {
  return err.message
 }
};

export const fetchAlbumInfoThroughId = async (id: string) => {
 try {
   const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/albums?id=${id}`);
   if(res !== "Failed")
    return res.data;
   return "Failed";
 }
 catch (err: any) {
  return err.message
 }
};