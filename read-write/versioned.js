"use strict"

const { readOptions, fileOptions } = require('../utility/settings')
const { log } = require('../utility/log')
const { writeVersionedFileRaw, readVersionedFileRaw } = require('../raw/versioned')

module.exports = { readVersionedFile, writeVersionedFile }

/**
 * @param {string} absolutePath
 * @param {string} fileName
 * @param {string} fileNameExtension
 * @return {Promise<null|string>}
 */
async function readVersionedFile(absolutePath, fileName, fileNameExtension) {
    return log(
        () => readVersionedFileRaw(absolutePath, fileName, fileNameExtension),
        ['readVersionedFile', absolutePath, fileName, fileNameExtension, readOptions()]
    )
}

/**
 * @param {string} absolutePath
 * @param {string} fileName
 * @param {string} fileNameExtension
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function writeVersionedFile(absolutePath, fileName, fileNameExtension, dataString) {
    return log(
        async () => writeVersionedFileRaw(absolutePath, fileName, fileNameExtension, dataString),
        ['writeVersionedFile', absolutePath, fileName, fileNameExtension, fileOptions()],
    )
}
