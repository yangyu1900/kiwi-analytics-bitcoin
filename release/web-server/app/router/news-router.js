var express = require("express");
var newsController = require("../controller/news-controller");

var router = express.Router();

router.get("/getNews", newsController.getNews);

module.exports = router;
