// messages
const MESSAGE_SUCCESS = "success";
const MESSAGE_ERROR = "failed";

// errors
const NOT_CORRECT_DATA = "not correct data";
const FORBIDDEN = "forbidden";
const INTERNAL_SERVER_ERROR = "internal server error";
const EXPIRED = "jwt expired";

// statuses
const STATUS_SUCCESS = 200;
const STATUS_NOT_CORRECT_DATA = 400;
const STATUS_FORBIDDEN = 400;
const STATUS_INTERNAL_SERVER_ERROR = 400;

// export
module.exports.ERROR_MESSAGES = {
	NOT_CORRECT_DATA,
	FORBIDDEN,
	INTERNAL_SERVER_ERROR,
	EXPIRED,
};

module.exports.STATUSES = {
	STATUS_SUCCESS,
	STATUS_NOT_CORRECT_DATA,
	STATUS_FORBIDDEN,
	STATUS_INTERNAL_SERVER_ERROR,
};

module.exports.MESSAGES = {
	MESSAGE_SUCCESS,
	MESSAGE_ERROR,
};
