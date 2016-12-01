//tweetPrefs.js
module.exports = { 
    searchParams: {
        retweet: {
            q: '#sloth OR #slothlove -#lust -#envy -#greed -#gluttony -#goonies -#sin', // https://dev.twitter.com/rest/public/search
            result_type: 'recent',
            lang: 'en'
        },
        follow: {
            count: 10,
            trim_user: true,
        }
    },
    frequency: {
        fav: 3 * (3600 * 1000), //Hours in Miliseconds
        retweet: 1 * (3600 * 1000),
        follow: 7 * (3600 * 1000)
    }
}
