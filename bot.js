var twit = require('twit');
var config = require('./config.js');
var tweetPrefs = require('./tweetPrefs.js');
var Logger = require('./logger.js');
var Twitter = new twit(config);
var Moment = require('moment');

var cachedTweets = null;
var lastFetch = new Date();
var cacheRefreshPeriod = new timespan.TimeSpan().addMinutes(15);

const Actions = {
    Follow: 'Follow',
    Retweet: 'Retweet',
    Favorite: 'Favorite'
};

/// Individual Capabilities

var follow = function() {
    initiateAction(tweetPrefs.searchParams.follow, Actions.Follow, 'Following', 'Followed')
};

var retweet = function() {
    initiateAction(tweetPrefs.searchParams.retweet, Actions.Retweet, 'Retweeting', 'Retweeted');
};

var favoriteTweet = function() {
    InitiateAction(tweetPrefs.searchParams.retweet, Actions.Favorite, 'Favoriting', 'Favorited');
};

//Structure of Calls and Actions

var initiateAction = function(searchParams, action, doing, done) {
    searchTweets(searchParams, function(err, data) {
        executeAction(err, data, action, postResource, createActionResponseCB(doing, done));
    });
}

var searchTweets = function(searchParams, callBack) {
    if(cachedTweets == null || timespan.fromDates(lastFetch, new Date()) > cacheRefreshPeriod ) {
        Twitter.get('search/tweets', searchParams, callBack);
    }
    else {
        Logger.debug('using cached Tweets');
        callBack(false, cachedTweets);
    }
};

var executeAction = function(err, data, action, postResource, requestCB){
    if(!err && data.statuses != undefined) {
        storeTweets(data);
        var randomTweet = ranDom(cachedTweets.statuses);
        if(typeof randomTweet != 'undefined') {
            if(action === Actions.Follow){
                Twitter.post(postResource, {
                    user_id: randomTweet.user.id_str,
                    follow: true
                }, requestCB);
            }
            else {
                Twitter.post(postResource, {id: randomTweet.id_str}, requestCB);
            }
        }
    }
    else {
        var msg = 'SEARCHING to ' + action.toUpperCase();
        if(!err){
            Logger.error(data, msg);
        }
        else {
            Logger.error(err, msg);
        }
    }
}

var createActionResponseCB = function(doing, complete){
    return function(err, response){
        if(err) {
            Logger.error(err, doing.toUpperCase());
        }
        else {
            Logger.info(complete + '!!!');
        }
    };
};

var storeTweets = function(data) {
    cachedTweets = data;
    lastFetch = new Date();
};

/// Random Tooling

var ranDom = function(arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};

/// Immediate Actions

favoriteTweet();
retweet();
//follow();

/// Ongoing Processes

setInterval(favoriteTweet, tweetPrefs.frequency.fav)

setInterval(retweet, tweetPrefs.frequency.retweet);

//setInterval(follow, tweetPrefs.frequency.follow);