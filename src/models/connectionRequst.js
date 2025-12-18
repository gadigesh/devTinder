const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // referance to the user connetion
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // referance to the user connetion
			required: true,
		},
		status: {
			type: String,
			enum: ["ignored", "interested", "accepted", "rejected"],
			default: "interested",
		},
	},
	{ timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
	if (this.fromUserId.equals(this.toUserId)) {
		return next(new Error("Cannot send connection to yourself"));
	}
});
module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
