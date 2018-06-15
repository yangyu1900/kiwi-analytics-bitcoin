var MongoClient = require("mongodb").MongoClient;
var settings = require("../settings");

var dbName = settings.dbName;

function _connectDB(callback) {
	var url = settings.dbUrl;
	MongoClient.connect(url, function (err, client) {
		if (err) {
			callback(err, null);
			return;
		}
		callback(null, client);
	});
}

module.exports.insertMany = function (collectionName, docs, callback) {
	_connectDB(function (err, client) {
		var db = client.db(dbName);
		db.collection(collectionName).insertMany(docs, function (err, result) {
			if (err) {
				callback(err, null);
				client.close();
				return;
			}
			callback(null, result);
			client.close();
		});
	});
};

module.exports.updateOne = function (collectionName, options, callback) {
	_connectDB(function (err, client) {
		var db = client.db(dbName);
		var conditions = options.conditions ? options.conditions : {};
		var update = options.update ? options.update : {};
		var option = options.option ? options.option : {};
		db.collection(collectionName).updateOne(conditions, update, option, function (err, result) {
			if (err) {
				callback(err, null);
				client.close();
				return;
			}
			callback(null, result);
			client.close();
		});
	});
}

module.exports.search = function (collectionName, options, callback) {
	var results = [];
	var conditions = options.conditions ? options.conditions : {};
	var operations = options.operations ? options.operations : {};
	var lmt = operations.limit ? operations.limit : 0;
	var st = operations.sort ? operations.sort : {};

	_connectDB(function (err, client) {
		var db = client.db(dbName);
		var cursor = db.collection(collectionName).find(conditions).sort(st).limit(lmt);
		cursor.each(function (err, doc) {
			if (err) {
				callback(err, null);
				client.close();
				return;
			}
			if (doc) {
				results.push(doc);
			} else {
				callback(null, results);
				client.close();
				return;
			}
		});
	});
};

