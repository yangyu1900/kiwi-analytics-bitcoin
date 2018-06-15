var Twitter = require('twitter-node-client').Twitter;
var settings = require('../settings');
var db = require('../models/db');

var newsCollectionName = settings.newsCollectionName;

var config = {
    "consumerKey": settings.consumerKey,
    "consumerSecret": settings.consumerSecret,
    "accessToken": settings.accessToken,
    "accessTokenSecret": settings.accessTokenSecret,
    "callBackUrl": settings.callBackUrl
}

var twitter = new Twitter(config);

function getTweetsByKeyword(keyword, numOfPosts) {
    //Callback functions
    var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
    };
    var success = function (data) {
        var tweets = [];
        var json = JSON.parse(data);
        json.statuses.forEach(
            function (item) {
                var text = item.text.trim();
                var title = text.substring(0, text.indexOf("http")).trim();
                var href = text.substring(text.lastIndexOf("http"));
                tweets.push(
                    {
                        "title": title,
                        "href": href
                    }
                );
            }
        );
        var options = { conditions: { "_id": 1 }, update: { $set: { "tweets": tweets } }, option: { upsert: true } };
        db.updateOne(newsCollectionName, options, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    }
    twitter.getSearch({ 'q': keyword, 'count': numOfPosts, 'result\_type': 'popular', 'include_entities': false }, error, success);
}

module.exports.collectTweets = function () {
    var keyword = "bitcoin";
    var numOfPosts = 25;
    getTweetsByKeyword(keyword, numOfPosts);
    setInterval(
        () => {
            getTweetsByKeyword(keyword, numOfPosts);
        }, 900000
    );
}
