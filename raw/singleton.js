"use strict"

const fs = require('node:fs')
const { fileOptions, readOptions } = require('../utility/settings')
const { makePathRaw, doesExistRaw } = require('./path')

/**
 * Only use this functions if there can not be any concurrent writes and reads!
 */
module.exports = { writeSingletonFileRaw, readSingletonFileRaw, removeSingletonFileRaw }

/**
 * @param {string} absoluteFilePath
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function writeSingletonFileRaw(absoluteFilePath, dataString){
    const exists = await doesExistRaw(absoluteFilePath)

    await fs.promises.writeFile(absoluteFilePath, dataString, fileOptions()).catch(async e => {
        if ('errno' in e && e.errno === -2) {
            await makePathRaw(absoluteFilePath.slice(0, absoluteFilePath.lastIndexOf('/')))
            await fs.promises.writeFile(absoluteFilePath, dataString, fileOptions())
        } else throw e
    })

    if (!exists) await fs.promises.chown(absoluteFilePath, 1000, 33)
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<string|null>}
 */
async function readSingletonFileRaw(absoluteFilePath) {
    return fs.promises.readFile(absoluteFilePath, readOptions()).catch(e => {
        if ('errno' in e && e.errno === -2) return null
        else throw e
    })
}

/**
 * @param {string} absoluteFilePath
 * @return {Promise<true|null>}
 */
async function removeSingletonFileRaw(absoluteFilePath) {
    return fs.promises.unlink(absoluteFilePath).then(() => true).catch(e => {
        if ('errno' in e && e.errno === -2) return null
        else throw e
    })
}
