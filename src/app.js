const express = require("express");
const app = express();

// app.use("/test", (req, res) => {
// 	res.send("Dashboard");
// });
// app.use((req, res) => {
// 	res.send("hello server");
// });
// app.use("/hellow", (req, res) => {
// 	res.send("welome to hellow");
// });

app.use("/gadi", (req, res) => {
	res.send("welcome to gadigesh");
});

app.listen(7777, () => {
	console.log("server started sucessfully 7777");
});
