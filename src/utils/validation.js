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

module.exports = { validateSignUpdata };
