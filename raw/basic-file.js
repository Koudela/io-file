const fs = require('node:fs')
const { randomUUID } = require('node:crypto')
const { fileOptions } = require('../utility/settings')
const { doesExistRaw, makePathRaw} = require('./path')
const { writeSingletonFileRaw } = require('./singleton')
const { readSingletonFileRaw, removeSingletonFileRaw } = require('./singleton')

module.exports = { appendFileRaw, readBasicFileRaw, writeBasicFileRaw, removeBasicFileRaw }

/**
 * @param {string} absoluteFilePath
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function appendFileRaw(absoluteFilePath, dataString) {
    const exists = await doesExistRaw(absoluteFilePath)

    await fs.promises.appendFile(absoluteFilePath, dataString, fileOptions()).catch(async e => {
        if ('errno' in e && e.errno === -2) {
            await makePathRaw(absoluteFilePath.slice(0, absoluteFilePath.lastIndexOf('/')))
            await fs.promises.appendFile(absoluteFilePath, dataString, fileOptions())
        } else throw e
    })

    if (!exists) await fs.promises.chown(absoluteFilePath, 1000, 33)
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<string|null>}
 */
async function readBasicFileRaw(absoluteFilePath) {
    return readSingletonFileRaw(absoluteFilePath)
}

/**
 * @param {string} absoluteFilePath
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function writeBasicFileRaw(absoluteFilePath, dataString) {
    // we use a workaround as 'fs.promises.writeFile' and 'fs.createWriteStream' causes overlapping content on concurrent writes
    const tmpFilePath = absoluteFilePath + '.' + randomUUID() + '.tmp'

    await writeSingletonFileRaw(tmpFilePath, dataString)

    return fs.promises.rename(tmpFilePath, absoluteFilePath)
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<null|true>}
 */
async function removeBasicFileRaw(absoluteFilePath) {
    return removeSingletonFileRaw(absoluteFilePath)
}
