var twit = require('twit');
var config = require('./config.js');
var tweetPrefs = require('./tweetPrefs.js');

var Twitter = new twit(config);

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
                        console.log('Retweeted!!!');
                    }
                    if(err){
                        console.log('Something went wrong while RETWEETING... Duplication maybe...');
			console.error(err.message);
                    }
                });
            }
        }
        else {
            console.log('Something went wrong while SEARCHING...');
        }
    });
};

var favoriteTweet = function(){
  // find the tweet
    Twitter.get('search/tweets', tweetPrefs, function(err,data){
        // find tweets
        var tweet = data.statuses;
        var randomTweet = ranDom(tweet);   // pick a random tweet

        // if random tweet exists
        if(typeof randomTweet != 'undefined'){
        // Tell TWITTER to 'favorite'
            Twitter.post('favorites/create', {
                id: randomTweet.id_str
            }, 
            function(err, response){
            // if there was an error while 'favorite'
                if(err){
                    console.log('CANNOT BE FAVORITE... Error');
		            console.error(err.message);
                }
                else{
                    console.log('FAVORITED... Success!!');
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

setInterval(favoriteTweet, tweetPrefs.frequency.fav)

setInterval(retweet, tweetPrefs.frequency.retweet);

module.exports.retweet = retweet;
module.exports.favoriteTweet = favoriteTweet;

