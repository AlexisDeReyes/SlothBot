var colors = require('colors');
var moment = require('moment');

const fs = require('fs');
const Console = require('console').Console

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// custom simple logger
const logger = new Console(output, errorOutput);


module.exports = {
    info: function(data){
        logger.log((moment().format() + ': ' + data).green);
    },
    debug: function(data) {
        logger.log((moment().format() + ': ' + data).gray);
    },
    warn: function(err, data){
        logger.log((moment().format() + ': ' + data).yellow);
        logger.log(err.message.yellow);
    },
    error: function(err, whatYoureDoing){
        logger.error((moment().format() + ': Something went wrong while ' + whatYoureDoing + '...').red);
        logger.error(err.message.red);
    }
}