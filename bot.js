// bot.js
/// Dependencies

var twit = require('twit');
var config = require('./config.js');
var tweetPrefs = require('./tweetPrefs.js');
var Logger = require('./logger.js');
var Twitter = new twit(config);
var moment = require('moment');
var sift = require('sift');

/// Caching variables

var cachedTweets = null;
var lastFetch = moment();
var cacheRefreshPeriod = moment.duration(1, 'hours').asMilliseconds();

/// Constansts

const Actions = {
    Follow: {
        action: 'Follow',
        doing: 'Following',
        done: 'Followed',
        postResource: 'friendships/create'
    },
    Retweet: {
        action: 'Retweet',
        doing: 'Retweeting',
        done: 'Retweeted',
        postResource: 'statuses/retweet/:id'
    },
    Favorite: {
        action: 'Favorite',
        doing: 'Favoriting',
        done: 'Favorited',
        postResource: 'favorites/create'
    }
};

/// Individual Capabilities

var follow = function() {
    initiateAction(tweetPrefs.searchParams.follow, Actions.Follow)
};

var retweet = function() {
    initiateAction(tweetPrefs.searchParams.retweet, Actions.Retweet);
};

var favoriteTweet = function() {
    initiateAction(tweetPrefs.searchParams.retweet, Actions.Favorite);
};

//Structure of Calls and Actions

var initiateAction = function(searchParams, action) {
    searchTweets(searchParams, action, function(err, data) {
        executeAction(err, data, action, createActionResponseCB(action.doing, action.done));
    });
}

var searchTweets = function(searchParams, action, callBack) {
    if(true || cachedTweets == null || (moment() - lastFetch) > cacheRefreshPeriod ) {
        Logger.debug('fetching tweets to ' + action.action)
        var resource = isFollow(action) ? 'statuses/home_timeline' : 'search/tweets';
        Twitter.get(resource, searchParams, callBack);
    }
    else {
        Logger.debug('using cached Tweets');
        callBack(false, cachedTweets);
    }
};

var executeAction = function(err, data, action, requestCB){
    var responseCheck = isFollow(action) ? !err : (data.statuses != undefined);
    if(!err && responseCheck) {
        storeTweets(data, action);
        var randomTweet = findAptTweet(cachedTweets.statuses, action);
        if(typeof randomTweet != 'undefined' && randomTweet != null) {
            if(isFollow(action)){
                Twitter.get('statuses/show/:id', {
                    id: randomTweet.retweeted_status.id_str
                }, function(err, data){
                    if(err) {
                        Logger.error(err, 'requesting a specific status for FOLLOWING');
                    }
                    else {
                        Logger.debug('About to Follow user ' + data.user.screen_name);
                        Twitter.post(action.postResource, {
                            user_id: data.user.id_str
                        }, requestCB)    
                    }
                });
            }
            else {
                Twitter.post(action.postResource, {id: randomTweet.id_str}, requestCB);
            }
        }
    }
    else {
        var msg = 'SEARCHING to ' + action.action.toUpperCase();
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

var isFollow = function(action){
    return action.action === Actions.Follow.action;
}

var storeTweets = function(data, action) {
    if(isFollow(action)){
        cachedTweets = {
            statuses: data
        };
    }
    else {
        cachedTweets = data;
    }
    lastFetch = new Date();
};

/// Random Tooling

var findAptTweet = function(arr, action) {
    var sifted = arr;
    if(action.action === Actions.Follow.action){
       sifted = sift({ user : { following: false}}, arr);
    } else if(action.action === Actions.Retweet.action){
        sifted = sift({ retweeted : false}, arr);
    } else {
        sifted = sift({ favorited : false}, arr);
    }
    if(sifted.length > 0){
        var index = Math.floor(Math.random()*sifted.length);
        return sifted[index];
    }
    return null;
};

/// Immediate Actions

//follow();

 favoriteTweet();
 setTimeout(retweet, 5000);
 setTimeout(follow, 10000);

/// Ongoing Processes

//setInterval(favoriteTweet, tweetPrefs.frequency.fav)

//setInterval(retweet, tweetPrefs.frequency.retweet);

//setInterval(follow, tweetPrefs.frequency.follow);

/// Exports

// module.exports.follow = follow;
// module.exports.retweet = retweet;
// module.exports.favoriteTweet = favoriteTweet;
