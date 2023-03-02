const express = require("express");
const fs = require("fs");
const { dirname } = require("path");
const { fileURLToPath } = require("url");
const bodyparser = require("body-parser");
const readXlsxFile = require("read-excel-file/node");
const mysql = require("mysql");
const multer = require("multer");
const app = express();

// const __dirname = dirname(fileURLToPath(import.meta.url));

// express
app.use(express.static("./public"));
app.use(bodyparser.json());
app.use(
	bodyparser.urlencoded({
		extended: true,
	})
);

// mysql
const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "test",
});

// mysql
// db.connect(function (err) {
// 	if (err) {
// 		return console.error("error: " + err.message);
// 	}
// 	console.log("Database connected.");
// });

// multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// cb(null, __basedir + "/uploads/");
		cb(null, "/nodejs-upload-excel-in-mysql-database/uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
	},
});

// multer
const uploadFile = multer({ storage: storage });

// express
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// express
app.post("/import-excel", uploadFile.single("import-excel"), (req, res) => {
	// importFileToDb(__basedir + "/uploads/" + req.file.filename);
	importFileToDb(
		"/nodejs-upload-excel-in-mysql-database/uploads/" + req.file.filename
	);
	console.log(res);
	// console.log(__basedir);
});

function importFileToDb(exFile) {
	readXlsxFile(exFile).then((rows) => {
		rows.shift();
		db.connect((error) => {
			if (error) {
				console.error(error);
			} else {
				let query = "INSERT INTO users (id, name, price) VALUES ?";
				db.query(query, [rows], (error, response) => {
					console.log(error || response);
				});
				db.end();
			}
		});
	});
}

// server
let nodeServer = app.listen(4000, function () {
	let port = nodeServer.address().port;
	let host = nodeServer.address().address;
	console.log("App working on: ", host, port);
});
