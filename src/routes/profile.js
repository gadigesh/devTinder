const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
	try {
		res.send(req.user);
	} catch (error) {
		res.status(401).send(error.message + " please login");
	}
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
	try {
		if (!validateEditProfileData) {
			throw new Error("invalid Edit requist");
		}
		const loggedInUser = req.user;
		Object.keys(req.body).forEach((key) => {
			loggedInUser[key] = req.body[key];
		});
		await loggedInUser.save();
		res.json({
			message: req.user.firstName + "Profile is successfully updated",
			data: loggedInUser,
		});
	} catch (error) {
		res.status(400).send("Error " + error.message);
	}
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
	try {
		const user = req.user;
		const newPassword = req.body.password;
		const isPasswordValid = await user.validatePassword(newPassword);
		if (isPasswordValid) {
			throw new Error("Password is same kindly update new passowrd");
		}
		req.user.password = await bcrypt.hash(newPassword, 10);
		await user.save();
		res.send(`${user.firstName}, Your password is successfully updated`);
	} catch (error) {
		res.status(400).send("Error " + error.message);
	}
});
module.exports = profileRouter;
