//tweetPrefs.js
module.exports = { 
    searchParams: {
        retweet: {
            q: '#sloth OR #slothlove -#lust -#envy -#greed -#gluttony -#goonies', // https://dev.twitter.com/rest/public/search
            result_type: 'recent',
            lang: 'en'
        },
        follow: {
            q: 'from:Sl0thB0t',
            result_type: 'popular',
            lang: 'en'
        }
    },
    frequency: {
        fav: 3 * (3600 * 1000), //Hours in Miliseconds
        retweet: 1 * (3600 * 1000),
        follow: 7 * (3600 * 1000)
    }
}
