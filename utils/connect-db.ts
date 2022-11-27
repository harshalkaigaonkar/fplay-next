import mongoose from "mongoose";

(async function dbConnect() {
	try {
		const db = await mongoose.connect("mongodb+srv://Harshal_k:b4wx4HEPz5dk63MO@fplay.nvhvf4g.mongodb.net/fplay?retryWrites=true&w=majority");
		console.log("MongoDB Connected");
	} catch (error) {
		console.log("Mongo Error: ", error);
		process.exit(1);
	}
})();