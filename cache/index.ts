import { createClient } from "redis"

const isConnected : {
    status?: boolean
} = {
};

export const client = createClient({
 url: `${process.env.REDIS_PUBLIC_URL}`
})

const redisManager = async () => {
    if(!isConnected.status) 
        try {
            await client.connect().then(() => isConnected.status = true);
            console.log('Redis Connected Successfully')
        } catch (error) {
            console.log("Error Connecting Redis\n", error);
            process.exit(1);
        }
    else 
        console.log("Redis already Connected!!")
}

export default redisManager;