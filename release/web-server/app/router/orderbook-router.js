var express = require("express");
var orderBookController = require("../controller/orderbook-controller");

var router = express.Router();

router.get("/getProductOderBook", orderBookController.getProductOrderBook);

module.exports = router;
