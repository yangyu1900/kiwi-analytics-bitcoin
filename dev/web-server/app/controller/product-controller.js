var db = require("../model/db.js");
var settings = require("../../settings.js");

var productCollectionName = settings.productCollectionName;
var forecastCollectionName = settings.forecastCollectionName;

module.exports.getLastDayHistoricRatesPerMin = function (req, res) {
	var numOfDocs = 24 * 60;
	var searchProductOptions = { operations: { sort: { "_id": -1 }, limit: numOfDocs } };
	db.search(productCollectionName, searchProductOptions, function (error, results) {
		if (error) {
			console.log(error);
		}
		if (results && results.length > 0) {
			// console.log(results);
			var lastDayHistoricRates = results;
			var searchForecastOptions = { operations: { sort: { "_id": -1 }, limit: numOfDocs } };
			db.search(forecastCollectionName, searchForecastOptions, function (err, docs) {
				if (err) {
					console.log(err);
				}
				if (docs) {
					for (var i = 0; i < docs.length; i++) {
						lastDayHistoricRates[i]["forecast"] = docs[i]["forecast"];
						lastDayHistoricRates[i]["mse"] = docs[i]["mse"];
					}
					res.json(lastDayHistoricRates.reverse());
				}
			});
		}
	})
};

module.exports.getCurrentRate = function (req, res) {
	var endOptions = { operations: { sort: { "_id": -1 }, limit: 1 } };
	db.search(productCollectionName, endOptions, function (error, results) {
		if (error) {
			console.log(error);
		}
		if (results && results.length > 0) {
			var doc = results[0];
			db.search(forecastCollectionName, endOptions, function (err, docs) {
				if (err) {
					console.log(err);
				}
				if (docs && docs.length > 0) {
					doc["forecast"] = docs[0]["forecast"];
					doc["mse"] = docs[0]["mse"];
					// console.log(doc);
					res.json(doc);
				}
			});
		}
	});
};