const mongoose = require("mongoose");
const validater = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const useSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			index: true,
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
			enum: {
				values: ["male", "female", "others"],
				message: ["{VALUE} is not supported"],
			},
		},
		photoURL: {
			type: String,
			default: "https://avatars.githubusercontent.com",
		},
		about: {
			type: String,
			default: "I am gadigesh is the default",
		},
		skills: {
			type: [String],
		},
	},
	{ timestamps: true }
);
useSchema.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, "DevTinder$250");
	return token;
};
useSchema.methods.validatePassword = async function (passwordByUser) {
	const user = this;
	const isPasswordValid = await bcrypt.compare(passwordByUser, user.password);
	return isPasswordValid;
};
module.exports = mongoose.model("User", useSchema);
