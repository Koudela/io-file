"use strict"

const { appendFileRaw } = require('../raw/basic-file')
const { isLogConsole, isLogFile, logDir, errorHandling } = require('./settings')

module.exports = { log }

/**
 * @param {function} callback
 * @param {array<any>} logAssets
 * @param {string|null} fileName
 * @return {Promise<undefined|any>} returns the result of the callback or undefined if an error was thrown
 */
async function log(callback, logAssets, fileName=null) {
    const toConsole = isLogConsole()
    const toFile = isLogFile()
    const startTime = toConsole || toFile ? new Date() : undefined
    const logFile = toFile ? `${ logDir() }/${ fileName ?? (new Date()).toISOString().substring(0, 10)+'.log' }` : undefined

    try {
        if (!toConsole && !toFile) return callback()

        const result = await callback()
        const timeOutput = `🕑 time ${ new Date() - startTime }ms`
        if (toConsole) console.log((new Date()).toISOString(), 'Log by io-file/utility/log:log()', ...logAssets, timeOutput)
        if (toFile) {
            const logContent = JSON.stringify([new Date(), 'Log by io-file/utility/log:log()', ...logAssets, timeOutput])
            appendFileRaw(logFile, `${ logContent }\r\n`).then()
        }

        return result
    } catch (e) {
        const timeOutput = `🕑 time ${ new Date() - startTime }ms`
        switch (errorHandling()) {
            case 'all':
            case 'log':
                if (toConsole) console.log((new Date()).toISOString(), 'Error caught by io-file/utility/log:log()', e.message, ...logAssets, timeOutput)
                if (toFile) {
                    const logContent = JSON.stringify([new Date, 'Error caught by io-file/utility/log:log()', e.message, ...logAssets, timeOutput])
                    appendFileRaw(logFile, logContent).then()
                }
                if (errorHandling() === 'all') throw e
                break;
            case 'throw':
            default:
                throw e
        }

        return undefined
    }
}
