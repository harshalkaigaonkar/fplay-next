import { createClient } from 'redis';

const isConnected: {
	connected?: boolean;
} = {};

export const client = createClient({
	url: `${process.env.REDIS_PUBLIC_URL}`,
});

const redisManager = async () => {
	if (!isConnected.connected)
		try {
			//ISSUE - as app is re-rendered, new client is getting connected to server. check on redisinsight
			await client.connect().then(() => (isConnected.connected = true));
			console.log('Redis Connected Successfully');
		} catch (error) {
			console.log('Error Connecting Redis\n', error);
			process.exit(1);
		}
	else console.log('Redis already Connected!!');
};

export default redisManager;
