import axios from "axios"

export const axiosGet = async (url: string) => {
 const res = await axios.get(url);
 return res;
} 