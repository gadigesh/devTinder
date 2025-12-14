const mongoose = require("mongoose");
const validater = require("validator");
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
			// validate(value) {
			// 	if (!validater.isEmail(value));
			// 	{
			// 		throw new Error("Invalid Email address" + value);
			// 	}
			// },
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
useSchema.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, "DevTinder$250", {
		expiresIn: "1h",
	});
	return token;
};
useSchema.methods.validatePassword = async function (passwordByUser) {
	const user = this;
	const isPasswordValid = await bcrypt.compare(passwordByUser, user.password);
	return isPasswordValid;
};
module.exports = mongoose.model("User", useSchema);
