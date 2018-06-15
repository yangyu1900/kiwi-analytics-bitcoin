var gdax = require("gdax");
var publicClient = new gdax.PublicClient();
var db = require("../models/db");
var settings = require("../settings");
var formatHelper = require("../utils/format-helper");

var productCollectionName = settings.productCollectionName;
var productId = "BTC-USD";

function getHistoricRates(numOfDays, granularity, intervalOfRequest, callback) {
    /* initialise parameters */
    var granularityOptions = [60, 300, 900, 3600, 21600, 86400];
    var numOfCandles = 300;
    var intervalOfResponse = numOfCandles * granularity * 1000;
    var initialNumOfIntervals = 1;
    var niter = Math.ceil(1.0 * numOfDays * 24 * 60 * 60 * 1000 / intervalOfResponse);
    var utc = new Date().getTime();
    var endTime = new Date(utc).toISOString();
    var startTime = new Date((utc - intervalOfResponse)).toISOString();

    var historicRates = [];

    /* retrieve data from gdax */
    (function retrieveData(niter, numOfIntervals) {
        /* validate granularity */
        if (!granularityOptions.includes(granularity)) {
            throw Error("The granularity field must be one of the following values: {60, 300, 900, 3600, 21600, 86400}.");
        }
        /* validate numOfDays */
        if (numOfDays % 1 != 0) {
            throw Error("The numOfDays field must be an integer");
        }

        /* use gdax client to get historic rates */
        publicClient.getProductHistoricRates(productId, { granularity: granularity, start: startTime, end: endTime }, function (err, res, data) {
            /* handle exceptions */
            if (err) {
                console.log(err);
            }
            if (res.statusCode != 200) {
                console.log(res.statusMessage);
            }
            /* format the data received as json object */
            var docs = formatHelper.formatHistoricRates(data);
            historicRates = historicRates.concat(docs);
            if (numOfIntervals == niter) {
                historicRates.reverse();
                db.insertMany(productCollectionName, historicRates, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    callback();
                });
            } else {
                numOfIntervals++;
                endTime = startTime;
                startTime = new Date((utc - numOfIntervals * intervalOfResponse)).toISOString();
                setTimeout(function () { retrieveData(niter, numOfIntervals) }, intervalOfRequest);
            }
        });
    })(niter, initialNumOfIntervals);
}

function updateProductRates() {
    var granularity = 60;
    publicClient.getProductHistoricRates(productId, { granularity: granularity }, function (err, response, data) {
        if (err) {
            console.log(err);
        }
        if (response.statusCode != 200) {
            console.log(response.statusMessage);
        }
        var docs = formatHelper.formatHistoricRates(data).reverse();
        var endOptions = { operations: { sort: { "_id": -1 }, limit: 1 } };
        db.search(productCollectionName, endOptions, function (error, results) {
            if (results && results.length > 0) {
                var endTime = results[0]._id;
                var docsToInsert = docs.filter((item) => item._id > endTime);
                if (docsToInsert.length > 0) {
                    db.insertMany(productCollectionName, docsToInsert, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
    });
}

module.exports.collectProductRates = function () {
    console.log("collecting rates");
    var numOfDays = 7;
    var granularity = 60;
    var intervalOfRequest = 500;
    getHistoricRates(numOfDays, granularity, intervalOfRequest, () => {
        updateProductRates();
        setInterval(updateProductRates, 60000);
    });
};

