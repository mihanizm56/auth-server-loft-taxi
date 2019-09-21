const Joi = require("@hapi/joi");

const usersSchema = Joi.object().keys({
	username: Joi.string()
		.min(1)
		.max(40)
		.required(),
	password: Joi.string().required(),
	blocked: Joi.boolean().required(),
});

module.exports = usersSchema;
