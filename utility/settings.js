"use strict"

const { readJSONConf, absolutePath, readConf } = require('ini-config-loader')

module.exports = { readOptions, fileOptions, dirOptions, dataDir, isVersionedTable, isLogConsole, isLogFile, logDir, errorHandling }

/**
 * @return {object} see https://nodejs.org/docs/latest/api/fs.html#filehandlereadfileoptions for details
 */
function readOptions() {
    return readJSONConf('io-file', 'DEFAULT_READ_OPTIONS') ?? { encoding:'utf8' }
}

/**
 * @return {object} see https://nodejs.org/docs/latest/api/fs.html#filehandlewritefiledata-options for details
 */
function fileOptions() {
    return readJSONConf('io-file', 'DEFAULT_FILE_OPTIONS') ?? { encoding:'utf8', mode: 0o664 }
}

/**
 * @return {object} see https://nodejs.org/docs/latest/api/fs.html#fspromisesmkdirpath-options for details
 */
function dirOptions() {
    return readJSONConf('io-file', 'DEFAULT_DIR_OPTIONS') ?? { recursive: true, mode: 0o775 }
}

/**
 * @return {string}
 */
function dataDir() {
    return absolutePath(readConf('io-file', 'DATA_DIR'))
}

/**
 * VERSIONED_TABLE_IDENTIFIERS looks like: ["someIdentifier","anotherIdentifier"]
 *
 * @param {string} tableName
 * @return {boolean}
 */
function isVersionedTable(tableName) {
    const identifiers = readJSONConf('io-file', 'VERSIONED_TABLE_IDENTIFIERS') ?? []

    return identifiers.some(identifier => tableName.includes(identifier))
}

const isLogConsoleMap = { 'all': true, 'console': true }
const isLogFileMap = { 'all': true, 'file': true }

/**
 * @return {boolean} depends on LOG_TYPE ('all'|'console'|'file'|'')
 */
function isLogConsole() {
    return isLogConsoleMap[readConf('io-file', 'LOG_TYPE')] ?? false
}

/**
 * @return {boolean} depends on LOG_TYPE ('all'|'console'|'file'|'')
 */
function isLogFile() {
    return isLogFileMap[readConf('io-file', 'LOG_TYPE')] ?? false
}

/**
 * @return {string}
 */
function logDir() {
    return absolutePath(readConf('io-file', 'LOG_DIR'))
}

/**
 * @return {'all'|'log'|'throw'}
 */
function errorHandling() {
    return readConf('io-file', 'ERROR_HANDLING')
}
