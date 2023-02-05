import { axiosGet } from "helpers";

export const fetchArtistsThroughSearchQuery = async (query: string, page:number = 1, entries: number = 20) => {
 try {
   const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/search/artists?query=${query.replaceAll(" ", "+")}&page=${page}&limit=${entries}`);
   if(res !== "Failed")
    return res.data;
   return "Failed";
 }
 catch (err: any) {
  return err.message
 }
}

export const fetchArtistInfoThroughId = async (id: string) => {
 try {
   const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/artists?id=${id}`);
   if(res !== "Failed")
    return res.data;
   return "Failed";
 }
 catch (err: any) {
  return err.message
 }
};

export const fetchArtistSongsThroughId = async (id: string, page: number = 1, category: string = 'latest') => {
 try {
   const res = await axiosGet(`${process.env.NEXT_PUBLIC_SONG_API}/artists/${id}/songs?page=${page}&category=${category}`);
   if(res !== "Failed")
    return res.data;
   return "Failed";
 }
 catch (err: any) {
  return err.message
 }
};