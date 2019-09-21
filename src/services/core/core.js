const sanitize = require("mongo-sanitize");
const {
	makeHashedPassword,
	comparePasswords,
} = require("../../utils/passwords/passwords");
const {
	ERROR_MESSAGES,
	STATUSES,
	MESSAGES,
} = require("../../constants/constants");
const {
	createAccessToken,
	createRefreshToken,
} = require("../../utils/tokens/tokens");

const CORE_EVENTS = global.CORE_EVENTS;
const VALIDATE_EVENTS = global.CORE_EVENTS;
const DATABASE_EVENTS = global.DATABASE_EVENTS;

CORE_EVENTS.on("users/add", async response => {
	const { data: { username, password } = {} } = response;
	const newUserData = {
		username,
		password: makeHashedPassword(password).toString(),
		blocked: false,
	};

	try {
		const validationResult = await VALIDATE_EVENTS.emit("validate/user", {
			...newUserData,
		});

		if (!validationResult)
			return response.reply({
				message: MESSAGES.MESSAGE_ERROR,
				error: ERROR_MESSAGES.NOT_CORRECT_DATA,
				status: STATUSES.STATUS_NOT_CORRECT_DATA,
			});

		const accessToken = await createAccessToken(username);
		const refreshToken = await createRefreshToken(username);

		if (!accessToken || !refreshToken) {
			return response.reply({
				message: MESSAGES.MESSAGE_ERROR,
				error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
				status: STATUSES.STATUS_INTERNAL_SERVER_ERROR,
			});
		}

		const addingResult = await DATABASE_EVENTS.emit("users/add", {
			...newUserData,
		});

		if (!addingResult)
			return response.reply({
				message: MESSAGES.MESSAGE_ERROR,
				error: ERROR_MESSAGES.FORBIDDEN,
				status: STATUSES.STATUS_FORBIDDEN,
			});

		return response.reply({
			message: MESSAGES.MESSAGE_SUCCESS,
			error: "",
			status: STATUSES.STATUS_SUCCESS,
			accessToken,
			refreshToken,
		});
	} catch (error) {
		console.log("error", error);

		return response.reply({
			message: MESSAGES.MESSAGE_ERROR,
			error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
			status: STATUSES.STATUS_INTERNAL_SERVER_ERROR,
		});
	}
});

CORE_EVENTS.on("users/check", async response => {
	const { data: { username, password } = {} } = response;
	const hashedPassword = makeHashedPassword(password);

	try {
		const { password: usersPassword } = await DATABASE_EVENTS.emit("user/get", {
			username,
		});

		if (usersPassword) {
			const isPasswordCorrect = comparePasswords(hashedPassword, usersPassword);

			console.log("isPasswordCorrect", isPasswordCorrect);

			if (isPasswordCorrect) {
				const accessToken = await createAccessToken(username);
				const refreshToken = await createRefreshToken(username);

				return response.reply({
					message: MESSAGES.MESSAGE_SUCCESS,
					error: "",
					status: STATUSES.STATUS_SUCCESS,
					accessToken,
					refreshToken,
				});
			}

			if (!isPasswordCorrect) {
				return response.reply({
					message: MESSAGES.MESSAGE_ERROR,
					error: ERROR_MESSAGES.FORBIDDEN,
					status: STATUSES.STATUS_FORBIDDEN,
				});
			}

			return response.reply({
				message: MESSAGES.MESSAGE_ERROR,
				error: ERROR_MESSAGES.NOT_CORRECT_DATA,
				status: STATUSES.STATUS_NOT_CORRECT_DATA,
			});
		} else {
			return response.reply({
				message: MESSAGES.MESSAGE_ERROR,
				error: ERROR_MESSAGES.NOT_CORRECT_DATA,
				status: STATUSES.STATUS_NOT_CORRECT_DATA,
			});
		}
	} catch (error) {
		console.log("error", error);

		return response.reply({
			message: MESSAGES.MESSAGE_ERROR,
			error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
			status: STATUSES.STATUS_INTERNAL_SERVER_ERROR,
		});
	}
});

CORE_EVENTS.on("users/token_verify", async response => {
	const token = response.data.token;
	const isRefresh = response.data.isRefresh;
	console.log("get the token to verify, isRefresh", isRefresh);

	if (Boolean(token)) {
		try {
			const validationResult = await VALIDATE_EVENTS.emit("validate/token", {
				token,
				isRefresh,
			});

			console.log("validation token result", validationResult);

			if (Boolean(validationResult && validationResult.username)) {
				const safetyUsername = sanitize(validationResult.username);
				console.log("safetyUsername from token", safetyUsername);
				const userData = await DATABASE_EVENTS.emit("user/get", {
					username: safetyUsername,
				});
				const isUserBlocked = userData.blocked;
				console.log("isUserBlocked", isUserBlocked);

				if (isUserBlocked) {
					return response.reply({
						message: MESSAGES.MESSAGE_ERROR,
						error: ERROR_MESSAGES.FORBIDDEN,
						status: STATUSES.STATUS_FORBIDDEN,
					});
				}

				const accessToken = await createAccessToken(safetyUsername);
				const refreshToken = await createRefreshToken(safetyUsername);

				return response.reply({
					message: MESSAGES.MESSAGE_SUCCESS,
					error: "",
					status: STATUSES.STATUS_SUCCESS,
					accessToken,
					refreshToken,
				});
			} else if (validationResult.expired) {
				return response.reply({
					message: MESSAGES.MESSAGE_ERROR,
					error: ERROR_MESSAGES.EXPIRED,
					status: STATUSES.STATUS_FORBIDDEN,
				});
			} else {
				return response.reply({
					message: MESSAGES.MESSAGE_ERROR,
					error: ERROR_MESSAGES.NOT_CORRECT_DATA,
					status: STATUSES.STATUS_NOT_CORRECT_DATA,
				});
			}
			console.log("validationResult token", validationResult);
		} catch (error) {
			console.log("error", error);

			return response.reply({
				message: MESSAGES.MESSAGE_ERROR,
				error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
				status: STATUSES.STATUS_INTERNAL_SERVER_ERROR,
			});
		}
	}
});
