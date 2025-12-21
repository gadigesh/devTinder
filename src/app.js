const express = require("express");
const connectDB = require("./config/database");
const cookiePaser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookiePaser());
app.use(
	cors({
		origin: "http://localhost:5174",
		credentials: true,
	})
);

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