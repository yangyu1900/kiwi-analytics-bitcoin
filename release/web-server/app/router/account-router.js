var express = require("express");
var accountController = require("../controller/account-controller.js");

var router = express.Router();

router.post("/register", accountController.doRegister);
router.post("/signin", accountController.doSignin);

module.exports = router;
