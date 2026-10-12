const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Mongoose connected succesfully");
	} catch (error) {
		console.log("There was an error:", error.message);
		throw error;
	}
};
module.exports = connectDB;


