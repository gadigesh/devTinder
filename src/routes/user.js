const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequst = require("../models/connectionRequst");

const userRouter = express();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
	try {
		const loggenInUser = req.user;
		//get all the pending connections requst
		const connectionRequst = await ConnectionRequst.find({
			toUserId: loggenInUser._id,
			status: "interested",
		}).populate("fromUserId", "firstName lastName about skills");
		// }).populate("fromUserId", ["firstName", "lastName"]);
		res.json({
			message: "Dtat fetched successfully ",
			data: connectionRequst,
		});
	} catch (error) {
		res.status(400).send("Error" + Error.message);
	}
});
const USER_SAVED_DATA = "firstName lastName about skills";
userRouter.get("/user/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connection = await ConnectionRequst.find({
			$or: [
				{ toUserId: loggedInUser._id, status: "accepted" },
				{ fromUserId: loggedInUser._id, status: "accepted" },
			],
		})
			.populate("fromUserId", USER_SAVED_DATA)
			.populate("toUserId", USER_SAVED_DATA);

		const data = connection.map((row) =>
			row.fromUserId._id.toString() === loggedInUser._id.toString()
				? row.toUserId
				: row.fromUserId
		);
		res.json({
			data: data,
		});
	} catch (error) {
		res.status(400).send("Error " + error.message);
	}
});

userRouter.get("/feed", userAuth, async (req, res) => {
	try {
		//his own card
		//his connections
		//ignored peaople
		//already sent the connection request
	} catch (error) {
		res.status(400).send("Error" + error.message);
	}
});
module.exports = userRouter;
