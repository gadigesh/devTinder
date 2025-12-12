const express = require("express");
const app = express();

app.use(
	"/user",
	(req, res, next) => {
		//Route handler

		//console.log("ahcgdf");
		next();
		//res.send("welome to hello");
	},
	(req, res) => {
		//2nd route res
		res.send("2 ndwelome to hello");
		console.log("ahcgdf");
	}
);

app.listen(7777, () => {
	console.log("server started sucessfully 7777");
});
