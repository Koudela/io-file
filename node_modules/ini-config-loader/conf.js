"use strict"

const { parseFile, configFiles } = require('./file-reader')

module.exports = { initConf, readConf, readJSONConf }

let confData = {}

function readJSONConf(module, name) {
    const envVar = readConf(module, name)

    if (typeof envVar !== 'string') return envVar

    confData[module][name] = JSON.parse(envVar)

    return confData[module][name]
}

function readConf(module, name) {
    return confData[module]?.[name] ?? null
}

async function initConf() {
    const newConfData = {}

    const files = await configFiles()
    await Promise.all(files.map(async fileName => {
        if (fileName.endsWith('.ini')) {
            const module = fileName.slice(0, -4)
            newConfData[module] = await parseFile('config/'+fileName)
        }
    }))

    confData = newConfData
}
