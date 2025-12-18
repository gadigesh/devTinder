const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookiePaser = require("cookie-parser");

app.use(express.json());
app.use(cookiePaser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requstRouter = require("./routes/requst");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requstRouter);
app.use("/", userRouter);

connectDB()
	.then(() => {
		app.listen(7777, () => {
			console.log("server started sucessfully 7777");
		});
	})
	.catch((error) => {
		console.error("Database is not connected");
	});