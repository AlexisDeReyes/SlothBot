var twit = require('twit');
var config = require('./config.js');
var tweetPrefs = require('./tweetPrefs.js');
var logger = require('./logger.js');

var Twitter = new twit(config);

var follow = function(subscribe) {
    Twitter.get('search/tweets', tweetPrefs.searchParams.follow, function(err, data) {
        if(!err){
            var tweets = data.statuses;
            var randomTweet = ranDom(tweets);
            
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
            logger.error(err, 'SEARCHING for FOLLOWERS')
        }
    });
}

var retweet = function() {
    
    Twitter.get('search/tweets', tweetPrefs.searchParams.retweet, function(err, data){
        if(!err){
            var tweets = data.statuses;
            var randomTweet = ranDom(tweets);
            
            if(typeof randomTweet != 'undefined'){
                Twitter.post('statuses/retweet/:id', {
                    id: randomTweet.id_str
                }, 
                function(err, response){
                    if(response){
                        logger.log('Retweeted!!!');
                    }
                    if(err){
                        logger.error(err, 'RETWEETING');
                    }
                });
            }
        }
        else {
            logger.error(err, 'SEARCHING for TWEETS')
        }
    });
};

var favoriteTweet = function(){
  // find the tweet
    Twitter.get('search/tweets', tweetPrefs, function(err,data) {
        var tweet = data.statuses;
        var randomTweet = ranDom(tweet);   // pick a random tweet

        if(typeof randomTweet != 'undefined') {
            Twitter.post('favorites/create', {
                id: randomTweet.id_str
            }, 
            function(err, response){
                if(err) {
                    logger.error(err, 'FAVORITING');
                }
                else{
                    logger.log('Favorited!!!');
                }
            });
        }
    });
}

// function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};

favoriteTweet();
retweet();

setInterval(favoriteTweet, tweetPrefs.frequency.fav)

setInterval(retweet, tweetPrefs.frequency.retweet);

//setInterval(follow, tweetPrefs.frequency.follow);