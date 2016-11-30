//tweetPrefs.js
/** TWITTER tweet Preferences
 * q
 * result_type
 * lang
 */
module.exports = 
    params: {
        q: '#sloth OR #slothlove', // https://dev.twitter.com/rest/public/search
        result_type: 'recent',
        lang: 'en'
    },
    frequency: {
        fav: 4.5 * (3600 * 1000), //Hours in Miliseconds
        retweet: 1 * (3600 * 1000)
    }
}
