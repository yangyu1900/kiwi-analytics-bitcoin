var express = require("express");
var productController = require("../controller/product-controller");

var router = express.Router();

router.get("/getLastDayHistoricRatesPerMin", productController.getLastDayHistoricRatesPerMin);
router.get("/getCurrentRate", productController.getCurrentRate);

module.exports = router;
