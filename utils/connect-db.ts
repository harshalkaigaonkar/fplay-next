import mongoose, { ConnectionStates } from 'mongoose';

const connection: {
	isConnected?: ConnectionStates;
} = {};

(async function dbConnect() {
	if (connection.isConnected) return;
	try {
		const db: typeof mongoose = await mongoose.connect(
			`${process.env.MONGO_URI}`,
		);
		connection.isConnected = db.connections[0].readyState;
		console.log('MongoDB Connected');
	} catch (error) {
		console.log('MongoDB Error: ', error);
		process.exit(1);
	}
})();
