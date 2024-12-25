"use strict"

const { log } = require('../utility/log')
const { dirOptions } = require('../utility/settings')
const { makePathRaw, removePathRaw, requirePathExistsRaw, doesExistRaw } = require('../raw/path')

module.exports = { doesExist, requirePathExists, makePath, removePath }

/**
 * @param {string} absolutePath
 * @return {Promise<boolean>}
 */
async function doesExist(absolutePath) {
    return log(
        () => doesExistRaw(absolutePath),
        ['doesExist', absolutePath]
    )
}

/**
 * @param {string} absoluteDirPath
 * @return {Promise<string>}
 */
async function requirePathExists(absoluteDirPath) {
    return log(
        () => requirePathExistsRaw(absoluteDirPath),
        ['requirePathExists', absoluteDirPath, dirOptions()],
    )
}

/**
 * @param {string} absoluteDirPath
 * @return {Promise<string>}
 */
async function makePath(absoluteDirPath) {
    return log(
        () => makePathRaw(absoluteDirPath),
        ['makePath', absoluteDirPath, dirOptions()],
    )
}

/**
 * @param {string} absoluteDirPath
 * @param {object} rmDirOptions
 * @return {Promise<null|true>}
 */
async function removePath(absoluteDirPath, rmDirOptions={ recursive: true, force: true }) {
    return log(
        () => removePathRaw(absoluteDirPath, rmDirOptions),
        ['removePath', absoluteDirPath, rmDirOptions],
    )
}
