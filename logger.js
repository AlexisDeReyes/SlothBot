var Console = require('console').Console;

const fs = require('fs');

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// custom simple logger
const logger = new Console(output, errorOutput);


module.exports = {
    log: function(data){
        logger.log(data);
    },
    error: function(err, whatYoureDoing){
        logger.error('Something went wrong while ' + whatYoureDoing + '...');
        logger.error(err.message);
    }
}