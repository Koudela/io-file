"use strict"

const { log } = require('../utility/log')
const { fileOptions, readOptions} = require('../utility/settings')
const { writeSingletonFileRaw, readSingletonFileRaw, removeSingletonFileRaw } = require('../raw/singleton')

/**
 * Only use this functions if there can not be any concurrent writes and reads!
 */
module.exports = { writeSingletonFile, readSingletonFile, removeSingletonFile }

/**
 * @param {string} absoluteFilePath
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function writeSingletonFile(absoluteFilePath, dataString) {
    return log(
        () => writeSingletonFileRaw(absoluteFilePath, dataString),
        ['writeSingletonFile', absoluteFilePath, fileOptions()],
    )
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<string|null>}
 */
async function readSingletonFile(absoluteFilePath) {
    return log(
        () => readSingletonFileRaw(absoluteFilePath),
        ['readSingletonFile', absoluteFilePath, readOptions()],
    )
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<true|null>}
 */
async function removeSingletonFile(absoluteFilePath) {
    return log(
        () => removeSingletonFileRaw(absoluteFilePath),
        ['removeSingletonFile', absoluteFilePath],
    )
}
