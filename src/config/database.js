const mongoos = require("mongoose");

const connectDB = async () => {
	await mongoos.connect(
		"mongodb+srv://gadigesh:gadigesh@gadigeshnode.4xmx0he.mongodb.net/devTinder"
	);
};

module.exports = connectDB;
