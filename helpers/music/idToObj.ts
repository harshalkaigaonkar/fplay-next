import { axiosGet } from "helpers"

export const fetchSongObj = async (id: string) => {
 try {
  if (id === '') return "Invalid Id!!";
  const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/songs?id=${id}`);
  if(res.results)
   return res.results;
  return "Something went wrong!!";
 } catch (error: any) {
  return error.message;
 }
}