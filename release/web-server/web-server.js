var express = require("express");
var bodyParser = require("body-parser");
var accountRouter = require("./app/router/account-router");
var productRouter = require("./app/router/product-router");
var orderBookRouter = require("./app/router/orderbook-router");
var newsRouter = require("./app/router/news-router");
var orderbookSpider = require("./app/data/orderbook-spider");
var path = require("path");

var app = express();

app.locals.orderBook = {};
setInterval(
    () => {
        orderbookSpider.collectProductOrderBook(function (book) {
            app.locals.orderBook = book;
        });
    }, 5000
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use("/kiwi/account", accountRouter);
app.use("/kiwi/product", productRouter);
app.use("/kiwi/orderbook", orderBookRouter);
app.use("/kiwi/news", newsRouter);
app.use("/", express.static(path.join(__dirname, "./public")));

app.listen(8000, "localhost");
