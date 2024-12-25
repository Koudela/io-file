"use strict"

const fs = require('node:fs')
const { absolutePath } = require('./base-dir')

module.exports = { parseFile, files, configFiles }

async function files() {
    const files = (await configFiles()).map(fileName => 'config/'+fileName)

    if (await pathExists(absolutePath('.env'))) files.push('.env')
    if (await pathExists(absolutePath('.env.local'))) files.push('.env.local')

    return files
}

async function configFiles() {
    const files = await pathExists(absolutePath('config'))
        ? await fs.promises.readdir(absolutePath('config'))
        : []

    return files.filter(fileName => fileName.endsWith('.ini'))
}

/**
 * @param {string} relativePath
 *
 * @return {Promise<{[p: string]: string}>}
 */
async function parseFile(relativePath) {
    if (!(await pathExists(absolutePath(relativePath)))) {
        return {}
    }

    const fileContent = await fs.promises.readFile(absolutePath(relativePath), { encoding:'utf8' }).catch(e => {
        if ('errno' in e && e.errno === -2) return ''

        throw e
    })

    const rows = fileContent.split("\n").filter(v => v.includes('='))

    return Object.fromEntries(rows.map(v => v.split('=', 2).map(v => v.trim())))
}

async function pathExists(absolutePath) {
    return fs.promises.stat(absolutePath).then(() => true).catch(() => false)
}
