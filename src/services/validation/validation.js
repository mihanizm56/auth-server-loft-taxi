const {
	refreshTokenVerify,
	accessTokenVerify,
} = require("../../utils/tokens/tokens");
const usersSchema = require("../../models/users/joi-schema");
const VALIDATE_EVENTS = global.CORE_EVENTS;

VALIDATE_EVENTS.on("validate/user", async response => {
	const userData = response.data;

	try {
		await usersSchema.validateAsync({ ...userData });

		response.reply(true);
	} catch (error) {
		console.log("validation user error", error);
		response.reply(false);
	}
});

VALIDATE_EVENTS.on("validate/token", async response => {
	const token = response.data.token;
	const isRefresh = response.data.isRefresh;
	try {
		const verifiedUsernameFromToken = isRefresh
			? await refreshTokenVerify(token)
			: await accessTokenVerify(token);
		console.log("verifiedUsernameFromToken", verifiedUsernameFromToken);

		return response.reply({ username: verifiedUsernameFromToken });
	} catch (error) {
		console.log("ERROR in the varification of the token", error);

		if (Boolean(error) && error.expired && Boolean(error.expired)) {
			return response.reply({ expired: true });
		}

		return response.reply(false);
	}
});
