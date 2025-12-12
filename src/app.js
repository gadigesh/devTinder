const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
	const user = new User({
		firstName: "Gadigesh",
		lastName: "Hiremath",
		email: "gchiremath.23@gmail.com",
		password: "gadigesh",
	});
	await user.save();
	res.send("User added succesfully");
});

connectDB()
	.then(() => {
		console.log("Dtabase connected successfully");
		app.listen(7777, () => {
			console.log("server started sucessfully 7777");
		});
	})
	.catch((err) => {
		console.error("Database is not connected");
	});
