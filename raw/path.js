"use strict"

const fs = require('node:fs')
const { dirOptions } = require('../utility/settings')

module.exports = { doesExistRaw, requirePathExistsRaw, makePathRaw, removePathRaw }

/**
 * @param {string} absolutePath
 * @return {Promise<boolean>}
 */
async function doesExistRaw(absolutePath) {
    return fs.promises.stat(absolutePath).then(() => true).catch(() => false)
}

/**
 * @param {string} absoluteDirPath
 * @return {Promise<string>}
 */
async function requirePathExistsRaw(absoluteDirPath) {
    if (!await doesExistRaw(absoluteDirPath)) await makePathRaw(absoluteDirPath)

    return absoluteDirPath
}

/**
 * @param {string} absoluteDirPath
 * @return {Promise<string>}
 */
async function makePathRaw(absoluteDirPath) {
    await fs.promises.mkdir(absoluteDirPath, dirOptions())
    await fs.promises.chown(absoluteDirPath, 1000, 33)

    return absoluteDirPath
}

/**
 * @param {string} absoluteDirPath
 * @param {object} rmDirOptions
 * @return {Promise<null|true>}
 */
async function removePathRaw(absoluteDirPath, rmDirOptions={ recursive: true, force: true }) {
    return fs.promises.rm(absoluteDirPath, rmDirOptions).then(() => true).catch(e => {
        if ('errno' in e && e.errno === -2) return null
        else throw e
    })
}
