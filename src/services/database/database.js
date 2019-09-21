const {
	getUserFromDbByUserName,
	addUserInDb,
	// getUserFromDbById unused
	// updateUserFromDb unused
	// deleteUserByUsername unused
} = require("../../models/users/model-methods.js");

const DATABASE_EVENTS = global.DATABASE_EVENTS;

DATABASE_EVENTS.on("users/add", async response => {
	const userData = response.data;
	console.log("userData in DATABASE_EVENTS", response.data);

	try {
		await addUserInDb(userData).save();
		response.reply(true);
	} catch (error) {
		console.log("error in adding user", error);
		response.reply(false);
	}
});

DATABASE_EVENTS.on("user/get", async response => {
	const { data: { username } = {} } = response;

	try {
		const userData = await getUserFromDbByUserName(username);
		if (userData) {
			return response.reply(userData);
		}

		return response.reply({});
	} catch (error) {
		console.log("error in adding user", error);

		return response.reply(false);
	}
});
