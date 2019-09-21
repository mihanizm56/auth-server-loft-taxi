const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		unique: false,
	},
	blocked: {
		type: Boolean,
		required: true,
		unique: false,
	},
});

mongoose.model("Users", usersSchema, "Users");
