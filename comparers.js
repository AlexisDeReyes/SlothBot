module.exports = {
    popularity: function(a,b){
        return a.followers_count - b.followers_count;
    },
    createCustomComparer: function(field){
        return function(a,b){
            return a[field] - b[field];
        };
    }
}