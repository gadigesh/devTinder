const mongoose = require("mongoose");

const connectionRequstSchema = mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.ObjectId,
			require: true,
		},
		toUserId: {
			type: mongoose.Schema.ObjectId,
			require: true,
		},
		status: {
			type: String,
			enum: {
				values: ["ignored", "interested", "accepted", "rejucted"],
				message: ["{VALUE} is not supported"],
			},
		},
	},
	{ timestamps: true }
);
connectionRequstSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequstSchema.pre("save", function () {
	const connectionRequst = this;
	// check if from userId and toUserId are same
	if (connectionRequst.fromUserId.equals(connectionRequst.toUserId)) {
		throw new Error("Cannot send the connection to yourself");
	}
});

const connectionRequstModel = new mongoose.model(
	"ConnectionRequst",
	connectionRequstSchema
);

module.exports = connectionRequstModel;
