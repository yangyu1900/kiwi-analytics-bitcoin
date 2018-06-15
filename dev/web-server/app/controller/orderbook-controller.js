module.exports.getProductOrderBook = function (req, res) {
	res.json(req.app.locals.orderBook);
}
