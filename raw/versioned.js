"use strict"

const fs = require('node:fs')
const { randomUUID } = require('node:crypto')
const { readOptions } = require('../utility/settings')
const { makePath } = require('./path')
const { writeSingletonFileRaw } = require('./singleton')

module.exports = { readVersionedFileRaw, writeVersionedFileRaw }

/**
 * @param {string} absolutePath
 * @param {string} fileName
 * @param {string} fileNameExtension
 * @return {Promise<null|string>}
 */
async function readVersionedFileRaw(absolutePath, fileName, fileNameExtension) {
    const absoluteFilePath = calcAbsoluteFilePath(absolutePath, fileName, fileNameExtension)

    return fs.promises.readFile(absoluteFilePath, readOptions).catch(async e => {
        if ('errno' in e && e.errno === -2) {
            const absolutDirPath = calcAbsoluteDirPath(absolutePath, fileName)
            const newestFilePath = await findNewestFilePath(absolutDirPath, fileNameExtension)
            if (newestFilePath === null) return null
            await link(newestFilePath, absoluteFilePath)

            return await readVersionedFileRaw(absolutePath, fileName, fileNameExtension)
        }

        throw e
    })
}

/**
 * @param {string} absolutePath
 * @param {string} fileName
 * @param {string} fileNameExtension
 * @param {string} dataString
 * @return {Promise<void>}
 */
async function writeVersionedFileRaw(absolutePath, fileName, fileNameExtension, dataString) {
    const absoluteVersionedFilePath = calcAbsoluteVersionFilePath(absolutePath, fileName, fileNameExtension)
    await writeSingletonFileRaw(absoluteVersionedFilePath, dataString)

    const absoluteFilePath = calcAbsoluteFilePath(absolutePath, fileName, fileNameExtension)
    await link(absoluteVersionedFilePath, absoluteFilePath)
}

/**
 * @param {string} absoluteDirPath
 * @param {string} fileNameExtension
 * @return {Promise<null|string>}
 */
async function findNewestFilePath(absoluteDirPath, fileNameExtension) {
    const fileNames = await fs.promises.readdir(absoluteDirPath, { encoding:'utf8' }).catch(() => [])
    const files = await Promise.all(fileNames.map(
        async name => ({
            name,
            stat:await fs.promises.stat(absoluteDirPath + name)
        })
    ))
    const newestFile = files.reduce((currentFile, file) => {
        if (!file.stat.isFile()) return currentFile
        if (fileNameExtension && fileNameExtension !== file.name.split('.').pop()) return currentFile
        if (currentFile === null) return file
        return file.stat.mtimeMs > currentFile.stat.mtimeMs ? file : currentFile
    }, null)

    if (newestFile !== null) return absoluteDirPath + newestFile.name

    const dirFile = calcAbsoluteDirFilePath(absoluteDirPath, fileNameExtension)

    return await fs.promises.stat(dirFile).then(() => dirFile).catch(() => null)
}

/**
 * @param {string} originalFilePath
 * @param {string} dummyFilePath
 * @return {Promise<void>}
 */
async function link(originalFilePath, dummyFilePath) {
    await fs.promises.link(originalFilePath, dummyFilePath).catch(async e => {
        if ('errno' in e) {
            if (e.errno === -2) {
                await makePath(dummyFilePath.slice(0, dummyFilePath.lastIndexOf('/')))

                return await link(originalFilePath, dummyFilePath)
            } else if (e.errno === -17) {
                await fs.promises.unlink(dummyFilePath).catch(async e => {
                    if ('errno' in e && e.errno === -2) return null
                    else throw e
                })

                return await link(originalFilePath, dummyFilePath)
            }
        }

        throw e
    })
}

/**
 * @param {string} absolutePath
 * @param {string} fileNameExtension
 * @return {string}
 */
function calcAbsoluteDirFilePath(absolutePath, fileNameExtension) {
    return absolutePath.slice(0, -1) + '.' + fileNameExtension
}

/**
 * @param {string} absolutePath
 * @param {string} fileName
 * @return {string}
 */
function calcAbsoluteDirPath(absolutePath, fileName) {
    return absolutePath + fileName + '/'
}

/**
 * @param {string} absolutePath
 * @param {string} fileName
 * @param {string} fileNameExtension
 * @return {string}
 */
function calcAbsoluteFilePath(absolutePath, fileName, fileNameExtension) {
     return calcAbsoluteDirPath(absolutePath, fileName) + fileName + '.' + fileNameExtension
}

/**
 * @param {string} absolutePath
 * @param {string} fileName
 * @param {string} fileNameExtension
 * @return {string}
 */
function calcAbsoluteVersionFilePath(absolutePath, fileName, fileNameExtension) {
    return calcAbsoluteDirPath(absolutePath, fileName) + (new Date()).toISOString() + '_' + randomUUID() + '.' + fileNameExtension
}
