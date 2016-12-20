var moment = require('moment')

const fs = require('fs')
const Console = require('console').Console

const output = fs.createWriteStream('./stdout.log')
const errorOutput = fs.createWriteStream('./stderr.log')
// custom simple logger
const logger = new Console(output, errorOutput)

var getString = function (thing) {
  if (typeof thing === 'object') {
    return JSON.stringify(thing)
  }
  return thing
}

module.exports = {
  info: function (data) {
    logger.log('INFO - ' + moment().format() + ': ' + getString(data))
  },
  debug: function (data) {
    logger.log('DEBUG - ' + moment().format() + ': ' + getString(data))
  },
  warn: function (err, data) {
    logger.log('WARN - ' + moment().format() + ': ' + getString(data) + '\n\t' + getString(err))
  },
  error: function (err, whatYoureDoing) {
    logger.error('ERROR - ' + moment().format() + ': Something went wrong while ' + whatYoureDoing + '...\n\t' + getString(err))
  }
}
