const dotenv = require("dotenv");
let dbURL;
dotenv.config();

module.exports.port = process.env.PORT || 8080;

switch (process.env.NODE_ENV) {
	case "development":
		dbURL = process.env.DB_URI_DEVELOPMENT;
		break;
	case "production":
		dbURL = process.env.DB_URI_PRODUCTION;
		break;

	default:
		dbURL = process.env.DB_URI_DEVELOPMENT;
		break;
}

module.exports.dbURL = dbURL;
