//tweetPrefs.js

var HoursInMilliseconds = 3600 * 1000;

module.exports = { 
    searchParams: {
        retweet: {
            q: '#sloth OR #slothlove -#lust -#envy -#greed -#gluttony -#goonies -#sin filter:safe', // https://dev.twitter.com/rest/public/search
            result_type: 'recent',
            lang: 'en'
        },
        follow: {
            count: 10
        },
        refollow: {
            screen_name: 'Sl0tHB0T',
            count: 200
        }
    },
    frequency: {
        fav: 3 * HoursInMilliseconds,
        retweet: 1 * HoursInMilliseconds,
        follow: 7 * HoursInMilliseconds,
        refollow: 2 * HoursInMilliseconds
    }
}
