const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const PRIVATE_KEY_ACCESS = process.env.JWT_SECRET_ACCESS;
const PRIVATE_KEY_REFRESH = process.env.JWT_SECRET_REFRESH;

const PUBLIC_KEY_ACCESS = process.env.JWT_PUBLIC_ACCESS;
const PUBLIC_KEY_REFRESH = process.env.JWT_PUBLIC_REFRESH;

const timeAccessTokenExpiresSeconds = process.env.TIME_TO_EXPIRE_ACCESS;
const timeRefreshTokenExpiresSeconds = process.env.TIME_TO_EXPIRE_REFRESH;

module.exports.createAccessToken = username =>
	new Promise((resolve, reject) => {
		jwt.sign(
			{ username },
			PRIVATE_KEY_ACCESS,
			{
				algorithm: "RS256",
				expiresIn: `${timeAccessTokenExpiresSeconds}s`,
			},
			(error, token) => {
				if (error) {
					console.log("error in create access token", error);
					return reject();
				}

				if (!token) {
					console.log("no token");
					return reject();
				}

				if (token) return resolve(token);
			}
		);
	});

module.exports.createRefreshToken = username =>
	new Promise((resolve, reject) => {
		jwt.sign(
			{ username },
			PRIVATE_KEY_REFRESH,
			{
				algorithm: "RS256",
				expiresIn: `${timeRefreshTokenExpiresSeconds}s`,
			},
			(error, token) => {
				if (error) {
					console.log("error in create refresh token", error);
					return reject();
				}

				if (!token) {
					console.log("no token");
					return reject();
				}

				if (token) return resolve(token);
			}
		);
	});

module.exports.refreshTokenVerify = token =>
	new Promise((resolve, reject) => {
		try {
			jwt.verify(
				token,
				PUBLIC_KEY_REFRESH,
				{ algorithms: ["RS256"] },
				(error, decoded) => {
					if (
						Boolean(error) &&
						error.message &&
						error.message === "jwt expired"
					) {
						console.log("JWT EXPIRED");
						return reject({ expired: true });
					}

					if (error) {
						console.log("error in decoding token", error);
						return reject();
					}

					if (!decoded.username) {
						console.log("no decode");
						return reject();
					}

					return resolve(decoded.username);
				}
			);
		} catch (error) {
			return reject();
		}
	});

module.exports.accessTokenVerify = token =>
	new Promise((resolve, reject) => {
		try {
			jwt.verify(
				token,
				PUBLIC_KEY_ACCESS,
				{ algorithms: ["RS256"] },
				(error, decoded) => {
					if (
						Boolean(error) &&
						error.message &&
						error.message === "jwt expired"
					) {
						console.log("JWT EXPIRED");
						return reject({ expired: true });
					}

					if (error) {
						console.log("error in decoding token", error);
						return reject();
					}

					if (!decoded.username) {
						console.log("no decode");
						return reject();
					}

					return resolve(decoded.username);
				}
			);
		} catch (error) {
			return reject();
		}
	});
