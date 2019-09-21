// register events
require("./utils/registry/registry-events");

// event listeners
require("./services/core/core");
require("./services/database/database");
require("./services/validation/validation");

// db events
require("./utils/db-listeners/db-listeners");

const dotenv = require("dotenv");
const os = require("os");
const cluster = require("cluster");
const createError = require("http-errors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const http_server = require("http");
const rateLimit = require("express-rate-limit");
const router = require("./routes/router.js");
const { port, dbURL } = require("./utils/variables/index.js");

/// prepare config for server
dotenv.config();
const app = express();
const server = http_server.createServer(app);
const limiter = rateLimit({
	windowMs: 10 * 1000, // 10 seconds
	max: 1000, // limit each IP requests per windowMs
});

/// middlewares
app.use(limiter);
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/login", router);
app.use((req, res, next) => {
	next(createError(404));
});
// eslint-disable-next-line
app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	res.status(err.status || 500);
});

/// func to run server
const startServer = (ownServer, ownPort) =>
	new Promise((resolve, reject) => {
		try {
			ownServer.listen(ownPort, () => {
				resolve(ownServer);
			});
		} catch (error) {
			reject(error);
		}
	});

// func to start the db connection
const startDB = () => {
	const options = {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	};

	mongoose.Promise = global.Promise;
	mongoose.connect(dbURL, options);
	mongoose.set("useCreateIndex", true);
	console.log("connected to mongo db");

	return mongoose.connection;
};

const startServerAndDB = serverPort => serverState => {
	startDB().once("open", () => {
		startServer(serverState, serverPort)
			// eslint-disable-next-line
			.then(server => {
				console.log("app started on port", port);
			})
			.catch(error => console.log("error during server start", error));
	});
};

const startApp = () => {
	if (process.env.NODE_ENV === "development") {
		startServerAndDB(port)(server);
		return;
	}

	if (process.env.NODE_ENV === "production") {
		if (cluster.isMaster) {
			const cpuArray = os.cpus();
			const numberOfCPUs = cpuArray.length;
			console.log(`your machine has ${numberOfCPUs} cores`);

			cpuArray.forEach((cpu, index) => {
				console.log(`cluster ${index} started`);
				cluster.fork();
			});

			cluster.on("exit", (worker, code) => {
				console.log(`Worker ${worker.id} finished. Exit code: ${code}`);
			});
		} else {
			startServerAndDB(port)(server);
		}

		return;
	}
};

startApp();
