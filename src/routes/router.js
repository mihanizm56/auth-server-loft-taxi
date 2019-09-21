const express = require("express");
const validateUserDataCtrl = require("../controllers/verify-user");
const addNewUserCtrl = require("../controllers/add-user");
const {
	refreshToken,
	authToken,
	sendPublicKey,
} = require("../controllers/tokens");

const router = express.Router();

router.post("/", validateUserDataCtrl);
router.put("/", addNewUserCtrl);
router.post("/refresh", refreshToken);
router.get("/token", authToken);
router.get("/public", sendPublicKey);

module.exports = router;
