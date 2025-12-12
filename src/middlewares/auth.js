export const adminAuth = (req, res, next) => {
	console.log("auth is checked!");
	const token = "xyz";
	const authToken = token === "xyz";
	if (!authToken) {
		res.send("user auth");
	} else {
		next();
	}
};
