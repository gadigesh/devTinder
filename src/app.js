const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const { validateSignUpdata } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookiePaser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookiePaser());
app.post("/signup", async (req, res) => {
	try {
		validateSignUpdata(req);
		const { firstName, lastName, email, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);
		const user = new User({
			firstName,
			lastName,
			email,
			password: passwordHash,
		});
		await user.save();
		res.send("User added succesfully");
	} catch (err) {
		res.status(401).send(err.message);
	}
});
app.post("/login", async (req, res) => {
	try {
		const { id, email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!email || !password) {
			return res.status(400).send("Email and password required");
		}
		if (!user) {
			throw new Error("email Id is not prsent in DB");
		}
		const isPasswordValid = await user.validatePassword(password);
		if (isPasswordValid) {
			const token = await user.getJWT();
			res.cookie("token", token);
			res.send("Login successfully");
		} else {
			throw new Error("Invalid credientials");
		}
	} catch (error) {
		res.status(401).send(error.message);
	}
});
app.get("/profile", userAuth, async (req, res) => {
	try {
		res.send(req.user);
	} catch (error) {
		res.status(401).send(error.message + " please login");
	}
});
app.post("/sendApiConnection", userAuth, async (req, res) => {
	console.log("sending connection");
	res.send(req.user.firstName + "sent the connection requst sent");
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
	const userId = req.params?.userId;
	const data = req.body;
	//console.log(data, "data");

	try {
		const UpdatesAllowed = ["userId", "photoUrl", "about"];
		const isUpdateAllowed = Object.keys(data).every((k) => {
			UpdatesAllowed.includes(k);
		});
		if (!isUpdateAllowed) {
			throw new Error("updates not allowed");
		}
		if (data?.skills.length > 10) {
			throw new Error(" not allowed more than 10");
		}
		const user = await User.findByIdAndUpdate({ _id: userId }, data, {
			runValidators: true,
		});
		res.send("user updated successfully");
		//user.delete();
	} catch (error) {
		res.status(401).send("update failed" + error.message);
	}
});

connectDB()
	.then(() => {
		app.listen(7777, () => {
			console.log("server started sucessfully 7777");
		});
	})
	.catch((err) => {
		console.error("Database is not connected");
	});