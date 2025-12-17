const validater = require("validator");
const validateSignUpdata = (req) => {
	const { firstName, lastName, email, password } = req.body;
	if (!firstName || !lastName) {
		throw new Error("Name is not Valid");
	}
	if (!validater.isStrongPassword(password)) {
		throw new Error("Please enter strong password");
	}
};
const validateEditProfileData = (req) => {
	const allowedEditFields = [
		"firstName",
		"lastName",
		"photoURL",
		"email",
		"password",
		"gender",
		"about",
		"skills",
	];
	const isEditAllowed = Object.keys(req.body).every((field) => {
		allowedEditFields.includes(field);
	});
	return isEditAllowed;
};

module.exports = { validateSignUpdata, validateEditProfileData };
