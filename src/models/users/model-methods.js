const mongoose = require("mongoose");
require("./model.js");

const UsersModel = mongoose.model("Users");

// get
module.exports.getUserFromDbById = id => UsersModel.findById(id);
module.exports.getUserFromDbByUserName = username =>
	UsersModel.findOne({ username });

// add
module.exports.addUserInDb = userData => {
	const newUser = new UsersModel(userData);

	return newUser;
};

// update
module.exports.updateUserFromDb = ({ id, userData }) =>
	UsersModel.findByIdAndUpdate(id, userData, { overwrite: false });

// delete
module.exports.deleteUserByUsername = ({ username }) =>
	UsersModel.deleteOne({ username });
