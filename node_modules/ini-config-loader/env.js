"use strict"

const { parseFile } = require('./file-reader')

module.exports = { isDevEnv, initEnv, readEnv, readJSONEnv }

let envData = {}
let isDev=null

/**
 * @return {boolean|null}
 */
function isDevEnv() {
    return isDev
}

function readJSONEnv(name) {
    const envVar = readEnv(name)

    if (typeof envVar !== 'string') return envVar

    envData[name] = JSON.parse(envVar)

    return envData[name]
}

function readEnv(name) {
    return envData[name] ?? null
}

async function initEnv() {

    const newEnvData = await parseFile('.env')
    const newLocalEnvData = await parseFile('.env.local')

    envData = Object.assign(newEnvData, newLocalEnvData)

    isDev = (envData['NODE_ENV'] ?? process.env.NODE_ENV) !== 'production';
}
