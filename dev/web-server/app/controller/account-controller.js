var db = require("../model/db.js");
var settings = require("../../settings.js");

module.exports.doSignin = function (req, res) {
	// console.log(req.body);
	var accountCollectionName = settings.accountCollectionName;
	var username = req.body.username;
	var password = req.body.password;
	var options = { conditions: { "username": username } };

	db.search(accountCollectionName, options, function (err, results) {
		if (err) {
			console.log(err);
		}
		// console.log(results);

		if (0 != results.length) {
			var user = results[0];
			if (user.password == password) {
				res.json(user);
				return;
			}
		}
		res.json({ ok: 0 });
	});
};

module.exports.doRegister = function (req, res) {
	// console.log(req.body);
	var accountCollectionName = settings.accountCollectionName;
	var user = req.body;

	db.insertOne(accountCollectionName, user, function (err, result) {
		if (err) {
			throw err;
		}
		// console.log("user saved" + "\n" + result);
		if (1 == result.insertedCount) {
			res.json({ "result": true });
			return;
		}
		res.json({ "result": false });
	});
};
