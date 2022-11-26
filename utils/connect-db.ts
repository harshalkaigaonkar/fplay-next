import mongoose from "mongoose";

(async function dbConnect() {
	try {
		const db = await mongoose.connect(`${process.env.MONGO_URI}`);
		console.log("MongoDB Connected");
	} catch (error) {
		console.log(error);
	}
})();