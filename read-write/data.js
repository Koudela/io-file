"use strict"

const fs = require('node:fs')
const { dataDir, isVersionedTable, readOptions, fileOptions } = require('../utility/settings')
const { removePathRaw } = require('../raw/path')
const { log } = require('../utility/log')
const { readVersionedFileRaw, writeVersionedFileRaw } = require('../raw/versioned')
const { writeBasicFileRaw } = require('../raw/basic-file')

module.exports = {
    calcAbsoluteTablePath,
    tableDataExists, readFromTable, writeToTable, removeFromTable, allTableIds,
}

/**
 * @param {string} tableName
 * @param {string} id
 * @return {Promise<boolean>}
 */
async function tableDataExists(tableName, id) {
    return log(
        async () => {
            const result = await readVersionedFileRaw(calcAbsoluteTablePath(tableName), id, 'json')

            return !!result
        },
        ['tableDataExists', tableName, id, readOptions()],
    )
}

/**
 * @param {string} tableName
 * @param {string} id
 * @return {Promise<any|null>}
 */
async function readFromTable(tableName, id) {
    return log(
        async () => {
            const result = await readVersionedFileRaw(calcAbsoluteTablePath(tableName), id, 'json')

            return result ? JSON.parse(result) : null

        },
        ['readFromTable', tableName, id, readOptions()],
    )
}

/**
 * @param {string} tableName
 * @param {string} id
 * @param {any} data
 * @return {Promise<void>}
 */
async function writeToTable(tableName, id, data) {
    return log(
        () => {
            return isVersionedTable(tableName)
                ? writeVersionedFileRaw(calcAbsoluteTablePath(tableName), id, 'json', JSON.stringify(data))
                : writeBasicFileRaw(`${ calcAbsoluteTablePath(tableName) }/${ id }/${ id }.json`, JSON.stringify(data))
        },
        ['writeToTable', tableName, id, fileOptions()]
    )
}

/**
 * @param {string} tableName
 * @param {string} id
 * @return {Promise<null|true>}
 */
async function removeFromTable(tableName, id) {
    return log(
        () => removePathRaw(calcAbsoluteTablePath(tableName)+id),
        ['removeFromTable', tableName, id],
    )
}

/**
 * @param {string} tableName
 * @return {Promise<string[]>}
 */
async function allTableIds(tableName) {
    return log(
        async () => {
            const tablePath = calcAbsoluteTablePath(tableName)
            const names = await fs.promises.readdir(tablePath)
            const rawIDs = await Promise.all(names.map(async name => {
                const stat = await fs.promises.lstat(tablePath+name)

                return stat.isDirectory() ? name : null
            }))

            return rawIDs.filter(id => id !== null)
        },
        ['allTableIds', tableName],
    )
}

/**
 * @param {string} relativeDataPath
 * @return {string}
 */
function calcAbsoluteTablePath(relativeDataPath) {
    return `${ dataDir() }/${ relativeDataPath }/`
}
