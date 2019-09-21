const sanitize = require("mongo-sanitize");
const {
	ERROR_MESSAGES,
	STATUSES,
	MESSAGES,
} = require("../constants/constants");

const CORE_EVENTS = global.CORE_EVENTS;

module.exports = async (req, res) => {
	console.log("check body in checkUserCreds", req.body);
	try {
		const username = sanitize(req.body.username);
		const password = sanitize(req.body.password);

		const result = await CORE_EVENTS.emit("users/check", {
			username,
			password,
		});

		console.log("result in checkUserCreds", result);

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
