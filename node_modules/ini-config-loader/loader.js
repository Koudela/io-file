"use strict"

const fs = require('node:fs')
const { absolutePath } = require('./base-dir')
const { initConf } = require('./conf')
const { initEnv, readEnv } = require('./env')
const { files } = require('./file-reader')

module.exports = { init, onConfigChanged }


async function configHasChanged() {
    return (await Promise.all((await files()).map(async fileName => fileHasChanged(fileName))))
        .some(val => val)
}

const mTimes={}
async function fileHasChanged(fileName) {
    if (!(fileName in mTimes)) return true

    return mTimes[fileName] < (await fs.promises.stat(absolutePath(fileName))).mtime
}

const assignMTime = async fileName => mTimes[fileName] = (await fs.promises.stat(absolutePath(fileName))).mtime
async function updateMTimes() {
    return Promise.all((await files()).map(assignMTime))
}

const registeredCallbacks=[]
function onConfigChanged(callback) {
    registeredCallbacks.push(callback)
}

async function init() {
    if (await configHasChanged()) {
        await initEnv()
        await initConf()
        await Promise.all(registeredCallbacks.map(callback => setTimeout(callback, 1)))
        await updateMTimes()
    }

    const timeout = parseInt(readEnv('CONFIG_LOADER_TIMEOUT'))

    if (!isNaN(timeout) && timeout > 0) setTimeout(init, timeout)
}
