const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
	//Read the token from the req and validate the token find the user
	try {
		const cookie = req.cookies;
		const { token } = cookie;
		if (!token) {
			throw new Error("Token is not valid");
		}
		const deCodedObj = jwt.verify(token, "DevTinder$250");
		const { _id } = deCodedObj;
		const user = await User.findById(_id);
		if (!user) {
			throw new Error("User Not found");
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send("Error: " + error.message);
	}
};

module.exports = {
	userAuth,
};
