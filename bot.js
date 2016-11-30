var twit = require('twit');
var config = require('./config.js');
var tweetPrefs = require('./tweetPrefs.js');
var logger = require('./logger.js');
var timespan = require('timespan');

var Twitter = new twit(config);

var cachedTweets = null;
var lastFetch = new Date();
var CacheRefreshPeriod = new timespan.TimeSpan().addMinutes(15);
var storeTweets = function(data) {
    cachedTweets = data;
    lastFetch = new Date();
}


var followCallBack = function(err, data){
    if(!err && data.statuses != undefined){
            storeTweets(data);
            var randomTweet = ranDom(cachedTweets.statuses);
            
            var followedSomeone = false;
            while(!followedSomeone){
                Twitter.post('friendships/create', {
                    user_id: randomTweet.user.id_str,
                    follow: subscribe
                }, function(err, data){
                    if(err){
                        logger.error(err, "FOLLOWING");
                    }
                    else {
                        logger.log('Followed Someone!!!!');
                    }   
                });
            }
        }
        else {
            if(!err){
                logger.error(data, 'SEARCHING for FOLLOWERS')
            }
            else {
                logger.error(err, 'SEARCHING for FOLLOWERS')
            }
        }
}

var follow = function(subscribe) {
    if(cachedTweets == null || timespan.fromDates(lastFetch, new Date()) > CacheRefreshPeriod ) {
        Twitter.get('search/tweets', tweetPrefs.searchParams.follow, followCallBack);
    }
    else {
        logger.log('using cached Tweets');
        followCallBack(false, cachedTweets);
    }
}

var retweetCallBack = function(err, data){
    if(!err && data.statuses != undefined){
            storeTweets(data);
            var randomTweet = ranDom(cachedTweets.statuses);
            
            if(typeof randomTweet != 'undefined'){
                Twitter.post('statuses/retweet/:id', {
                    id: randomTweet.id_str
                }, 
                function(err, response){
                    if(err){
                        logger.error(err, 'RETWEETING');
                    }
                    else {
                        logger.log('Retweeted!!!');
                    }
                });
            }
        }
        else {
            if(!err){
                logger.error(data, 'SEARCHING for TWEETS')
            }
            else {
                logger.error(err, 'SEARCHING for TWEETS')
            }
        }
}

var retweet = function() {
    if(true || cachedTweets == null || timespan.fromDates(lastFetch, new Date()) > CacheRefreshPeriod) {
        Twitter.get('search/tweets', tweetPrefs.searchParams.retweet, retweetCallBack);
    }
    else {
        logger.log('using cached Tweets');
        retweetCallBack(false, cachedTweets);
    }
};

var favoriteCallBack = function(err, data) {
    if(!err && data.statuses != undefined) {
            
            storeTweets(data)
            var randomTweet = ranDom(cachedTweets.statuses);   // pick a random tweet

            if(typeof randomTweet != 'undefined') {
                Twitter.post('favorites/create', {
                    id: randomTweet.id_str
                }, 
                function(err, response){
                    if(err) {
                        logger.error(err, 'FAVORITING');
                    }
                    else {
                        logger.log('Favorited!!!');
                    }
                });
            }
        }
        else {
            if(!err){
                logger.error(data, 'SEARCHING to FAVORITE')
            }
            else {
                logger.error(err, 'SEARCHING to FAVORITE')
            }
        }
}

var favoriteTweet = function() {
    if(true || cachedTweets == null || timespan.fromDates(lastFetch, new Date()) > CacheRefreshPeriod) {
        Twitter.get('search/tweets', tweetPrefs.searchParams.retweet, favoriteCallBack);
    }
    else {
        logger.log('using cached Tweets');
        favoriteCallBack(false, cachedTweets);
    }
};

var ranDom = function(arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};

favoriteTweet();
retweet();
//follow();

setInterval(favoriteTweet, tweetPrefs.frequency.fav)

setInterval(retweet, tweetPrefs.frequency.retweet);

//setInterval(follow, tweetPrefs.frequency.follow);