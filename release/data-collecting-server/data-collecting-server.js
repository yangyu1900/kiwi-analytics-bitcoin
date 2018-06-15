var gdaxSpider = require("./spiders/gdax-spider");
var twitterSpider = require("./spiders/twitter-spider");

gdaxSpider.collectProductRates();
twitterSpider.collectTweets();