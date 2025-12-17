const express = require("express");
const requstRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const mongoose = require("mongoose");
const ConnectionRequest = require("../models/connectionRequst");

requstRouter.post(
	"/request/send/:status/:toUserId",
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			const allowedStatus = ["interested", "ignored"];
			if (!allowedStatus.includes(status)) {
				return res.status(400).json({ message: "Invalid status type" });
			}

			const connectionRequest = new ConnectionRequest({
				fromUserId,
				toUserId,
				status,
			});
			const toUser = await User.findById(toUserId);
			if (!toUser) {
				return res.status(400).send("Uer not found");
			}
			// If there is an existing connections
			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{
						fromUserId,
						toUserId,
					},
					{
						fromUserId: toUserId,
						toUserId: fromUserId,
					},
				],
			});

			if (existingConnectionRequest) {
				throw new Error("connetion requst already exist");
			}
			const data = await connectionRequest.save();
			res.json({
				message:
					req.user.firstName +
					"is" +
					status +
					"in" +
					toUser.firstName,
				data,
			});
		} catch (error) {
			res.status(400).send("Eorror " + error.message);
		}
	}
);

requstRouter.post(
	"/request/review/:status/:requstId",
	userAuth,
	async (req, res) => {
		try {
			const loggedInUser = req.user;
			const { status, requstId } = req.params;

			const allowedStatus = ["accepted", "rejected"];
			if (!allowedStatus.includes(status)) {
				return res.status(400).json({ message: "Status not allowed" });
			}

			if (!mongoose.Types.ObjectId.isValid(requstId)) {
				return res.status(400).json({ message: "Invalid request ID" });
			}
			const connection = await ConnectionRequest.findOne({
				status: "interested",
				toUserId: loggedInUser._id,
			});
			if (!connection) {
				return res.status(400).json({
					message: "Connection request not found",
				});
			}

			connection.status = status;
			const data = await connection.save();

			res.json({
				message: `Connection request ${status}`,
				data,
			});
		} catch (error) {
			res.status(400).send("Error: " + error.message);
		}
	}
);
module.exports = requstRouter;
