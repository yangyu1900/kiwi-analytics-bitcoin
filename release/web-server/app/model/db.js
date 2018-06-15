var mongoClient = require("mongodb").MongoClient;
var settings = require("../../settings.js");
var dbName = settings.dbName;

function _connectDB(callback) {
	var dbUrl = settings.dbUrl;

	mongoClient.connect(dbUrl, function (err, client) {
		if (err) {
			callback(err, null);
			return;
		}
		callback(null, client);
	});
}

module.exports.insertMany = function (collectionName, docs, callback) {
	-_connectDB(function (err, client) {
		var db = client.db(dbName);
		db.collection(collectionName).insertMany(docs, function (err, results) {
			callback(err, results);
			client.close();
		});
	});
};

module.exports.insertOne = function (collectionName, doc, callback) {
	_connectDB(function (err, client) {
		var db = client.db(dbName);
		db.collection(collectionName).insertOne(doc, function (err, result) {
			callback(err, result);
			client.close();
		});
	});
};

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
