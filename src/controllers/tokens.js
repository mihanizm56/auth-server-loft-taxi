const dotenv = require("dotenv");
const {
	ERROR_MESSAGES,
	STATUSES,
	MESSAGES,
} = require("../constants/constants");
dotenv.config();

const PUBLIC_KEY_ACCESS = process.env.JWT_PUBLIC_ACCESS;

const CORE_EVENTS = global.CORE_EVENTS;

module.exports.refreshToken = async (req, res) => {
	try {
		const refreshToken = req.body.token;
		console.log("refreshToken", refreshToken);

		const result = await CORE_EVENTS.emit("users/token_verify", {
			token: refreshToken,
			isRefresh: true,
		});

		return res.status(result.status).json({
			message: result.message,
			error: result.error,
			access_token: result.accessToken,
			refresh_token: result.refreshToken,
		});
	} catch (error) {
		console.log(error);

		return res.status(STATUSES.STATUS_INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.MESSAGE_ERROR,
			error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
		});
	}
};

module.exports.authToken = async (req, res) => {
	const authorizationHeader = req.headers.authorization;
	const token = authorizationHeader.split(" ")[1];

	console.log("authorizationHeader", authorizationHeader);
	console.log("token", token);
	try {
		const result = await CORE_EVENTS.emit("users/token_verify", {
			token,
			isRefresh: false,
		});

		return res.status(result.status).json({
			message: result.message,
			error: result.error,
		});
	} catch (error) {
		console.log(error);

		return res.status(STATUSES.STATUS_INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.MESSAGE_ERROR,
			error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
		});
	}
};

module.exports.sendPublicKey = (req, res) =>
	res.status(200).json({ PUBLIC_KEY_ACCESS });
