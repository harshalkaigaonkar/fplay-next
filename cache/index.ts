import { createClient } from "redis"

export const client = createClient({
 url: `${process.env.REDIS_PUBLIC_URL}`
})

const redisManager = async () => {
 try {
  await client.connect();
  await console.log('Redis Connected Successfully')
 } catch (error) {
  console.log("Error Connecting Redis\n", error);
  process.exit(1);
 }
}

export default redisManager;