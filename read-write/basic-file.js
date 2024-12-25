const { readOptions, fileOptions } = require('../utility/settings')
const { log } = require('../utility/log')
const { appendFileRaw, readBasicFileRaw, writeBasicFileRaw, removeBasicFileRaw } = require('../raw/basic-file')

module.exports = { appendFile, readBasicFile, writeBasicFile, removeBasicFile }

/**
 * @param {string} absoluteFilePath
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function appendFile(absoluteFilePath, dataString) {
    return log(
        async () => appendFileRaw(absoluteFilePath, dataString),
        ['appendFile', absoluteFilePath, fileOptions()]
    )
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<string|null>}
 */
async function readBasicFile(absoluteFilePath) {
    return log(
        () => readBasicFileRaw(absoluteFilePath),
        ['readBasicFile', absoluteFilePath, readOptions()],
    )
}

/**
 * @param {string} absoluteFilePath
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function writeBasicFile(absoluteFilePath, dataString) {
    return log(
        async () => writeBasicFileRaw(absoluteFilePath, dataString),
        ['writeBasicFile', absoluteFilePath, fileOptions()],
    )
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<null|true>}
 */
async function removeBasicFile(absoluteFilePath) {
    return log(
        () => removeBasicFileRaw(absoluteFilePath),
        ['removeBasicFile', absoluteFilePath],
    )
}
