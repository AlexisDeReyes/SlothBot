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
        logger.log('INFO - ' + moment().format() + ': ' + data);
    },
    debug: function(data) {
        logger.log('DEBUG - ' + moment().format() + ': ' + data);
    },
    warn: function(err, data){
        logger.log('WARN - ' + moment().format() + ': ' + data + '\n\t' + err.message);
    },
    error: function(err, whatYoureDoing){
        logger.error('ERROR - ' + moment().format() + ': Something went wrong while ' + whatYoureDoing + '...\n\t' + err.message);
    }
}