import axios from "axios"

export const axiosGet = async (url: string) => {
 const res = await axios.get(url);
 if(res.data)
 return res.data;
 return "Failed";
} 

export const ramdomEmojiText = (): string => {
 const emojis: string[] = [":fire:", ":wave:"]
 const index = Math.floor(Math.random() * emojis.length);
 return emojis[index];
}

export const secToMin = (sec: number): string => {
    return `${Math.floor(sec/60)}:${Math.ceil(sec%60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}`
}