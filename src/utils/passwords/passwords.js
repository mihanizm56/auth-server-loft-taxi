const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();
const salt = process.env.SALT;

/// func to hash the password
module.exports.makeHashedPassword = purePassword =>
	crypto.pbkdf2Sync(purePassword, salt, 1000, 64, "sha512");

/// func to compare two hashed passwords
module.exports.comparePasswords = (passwordOne, passwordTwo) =>
	Boolean(passwordOne.toString() === passwordTwo.toString());
