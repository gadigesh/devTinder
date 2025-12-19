const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequst = require("../models/connectionRequst");
const User = require("../models/user");

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
		// skip = (page -1)*limit
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 50 ? 50 : limit;
		const loggedInUser = req.user;
		const connectRequst = await ConnectionRequst.find({
			$or: [
				{
					fromUserId: loggedInUser._id,
				},
				{
					toUserId: loggedInUser._id,
				},
			],
		}).select("fromUserId toUserId");
		const hdeUsersFromFeed = new Set();
		connectRequst.forEach((req) => {
			hdeUsersFromFeed.add(req.fromUserId.toString());
			hdeUsersFromFeed.add(req.toUserId.toString());
		});
		console.log(hdeUsersFromFeed);
		const users = await User.find({
			$and: [
				// { _id: { $nin: Array.from(hdeUsersFromFeed) } },
				{ _id: { $ne: loggedInUser._id } },
			],
		})
			.select(USER_SAVED_DATA)
			.skip((page - 1) * limit)
			.limit(limit);
		res.send(users);
	} catch (error) {
		res.status(400).send("Error" + error.message);
	}
});
module.exports = userRouter;
