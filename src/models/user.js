const mongoose = require("mongoose");
const useSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
		},
		age: {
			type: Number,
		},
		gender: {
			type: String,
			validate(value) {
				if (!["male", "female", "others"].includes(value)) {
					throw new Error("Gender data is not valid");
				}
			},
		},
		photoUrl: {
			type: String,
		},
		about: {
			type: String,
			default: "I am gadigesh is the default",
		},
		skilts: {
			type: [String],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", useSchema);
