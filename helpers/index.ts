import axios from "axios"

export const axiosGet = async (url: string) => {
 const res = await axios.get(url);
 return res;
} 

export const ramdomEmojiText = (): string => {
 const emojis: string[] = [":fire:", ":wave:"]
 const index = Math.floor(Math.random() * emojis.length);
 return emojis[index];
}