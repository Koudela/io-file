"use strict"

const { readBasicFile, writeBasicFile, removeBasicFile, appendFile } = require('./read-write/basic-file')
const { calcAbsoluteTablePath, tableDataExists, readFromTable, writeToTable, removeFromTable, allTableIds } = require('./read-write/data')
const { doesExist, requirePathExists, makePath, removePath } = require('./read-write/path')
const { readSingletonFile, writeSingletonFile, removeSingletonFile } = require('./read-write/singleton')
const { readVersionedFile, writeVersionedFile } = require('./read-write/versioned')
const { log } = require('./utility/log')
const { readOptions, fileOptions, dirOptions } = require('./utility/settings')

module.exports = {
    readBasicFile, writeBasicFile, removeBasicFile, appendFile,
    calcAbsoluteTablePath, tableDataExists, readFromTable, writeToTable, removeFromTable, allTableIds,
    doesExist, requirePathExists, makePath, removePath,
    readSingletonFile, writeSingletonFile, removeSingletonFile,
    readVersionedFile, writeVersionedFile,
    log,
    readOptions, fileOptions, dirOptions,
}
