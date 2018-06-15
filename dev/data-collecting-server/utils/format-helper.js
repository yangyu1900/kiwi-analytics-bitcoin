/* data format: [ time, low, high, open, close, volume ] */
module.exports.formatHistoricRates = function (data) {
	var docs = [];
	for (var i = 0; i < data.length - 1; i++) {
		var doc = {
			"_id": data[i][0],
			"low": data[i][1],
			"high": data[i][2],
			"open": data[i][3],
			"close": data[i][4],
			"volume": data[i][5]
		};
		docs.push(doc);
	}
	return docs;
};
