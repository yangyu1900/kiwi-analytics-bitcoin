var gdax = require("gdax");
var publicClient = new gdax.PublicClient();

module.exports.collectProductOrderBook = function (callback) {
    var productId = "BTC-USD";
    var lv = 3;
    publicClient.getProductOrderBook(productId, { level: lv }, function (error, response, book) {
        if (error) {
            console.log(error);
        }
        if (response.statusCode != 200) {
            console.log(response.statusMessage);
        }
        callback(book);
    });
}
