const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
	const user = new User(req.body);
	await user.save();
	res.send("User added succesfully");
});
app.get("/user", async (req, res) => {
	const userEmail = req.body.email;
	try {
		const users = await User.find({ email: userEmail });
		if (!users) {
			res.status(401).send("email id not found");
		} else {
			res.send(users);
		}
		// if (users.lenngth === 0) {
		// 	res.status(404).send("User not found");
		// } else {
		// 	res.send(users);
		// }
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});
app.get("/feed", async (req, res) => {
	const userEmail = req.body.email;
	try {
		const allUsers = await User.find({});
		res.send(allUsers);
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});
app.delete("/user", async (req, res) => {
	const userId = req.body.userId;
	try {
		const user = await User.findByIdAndDelete({ _id: userId });
		res.send("user deleted successfully");
		//user.delete();
	} catch (error) {
		res.status(401).send("something wrong");
	}
});

app.patch("/user", async (req, res) => {
	const userId = req.body.userId;
	const data = req.body;
	console.log(data, "data");
	try {
		const user = await User.findByIdAndUpdate({ _id: userId }, data);
		res.send("user updated successfully");
		//user.delete();
	} catch (error) {
		res.status(401).send("something wrong");
	}
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