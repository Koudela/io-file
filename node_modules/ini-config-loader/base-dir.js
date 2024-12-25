"use strict"

const fs = require('node:fs')

let baseDir = __dirname.split('/')
while (baseDir.length > 0 && !fs.existsSync(baseDir.join('/')+'/.env')) baseDir.pop()
const BASE_DIR = baseDir.join('/')+'/'

module.exports = { absolutePath }

function absolutePath(relativePath) {
    if (typeof relativePath !== 'string')
        throw new Error('Error in ini-config-loader/base-dir:absolutePath(): argument '+JSON.stringify(relativePath)+' is not a valid string')

    if (relativePath.startsWith('/'))
        return relativePath

    return `${ BASE_DIR }${ relativePath }`
}
