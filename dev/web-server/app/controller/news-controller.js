var settings = require('../../settings');
var db = require('../model/db');

module.exports.getNews = function (req, res) {
	var newsCollectionName = settings.newsCollectionName;
	var searchOptions = { conditions: { "_id": 1 } };
	db.search(newsCollectionName, searchOptions, function (err, results) {
		if (err) {
			console.log(err);
		}
		if (results && results.length > 0) {
			res.json(results[0].tweets);
		}
	});
};
