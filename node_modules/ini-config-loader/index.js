"use strict"

const { absolutePath } = require('./base-dir')
const { isDevEnv, readEnv, readJSONEnv } = require('./env')
const { readConf, readJSONConf } = require('./conf')
const { init, onConfigChanged } = require('./loader')

module.exports = {
    absolutePath,
    isDevEnv,
    readEnv,
    readJSONEnv,
    readConf,
    readJSONConf,
    init,
    onConfigChanged,
}