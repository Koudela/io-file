/**
 * ini-config-loader
 * env and config file loader
 *
 * @package ini-config-loader
 * @link https://github.com/Koudela/ini-config-loader/
 * @copyright Copyright (c) 2022-2025 Thomas Koudela
 * @license http://opensource.org/licenses/MIT MIT License
 */

const fs = require('node:fs');
const test = require('ava')

const {
    init, readEnv, readJSONEnv, readConf, readJSONConf, absolutePath, isDevEnv, onConfigChanged
} = require('ini-config-loader')

init().then(() => {
    test.serial('readEnv .env', t => {
        t.is(readEnv('ENV_VALUE'), 'hello world!')
    })

    test.serial('readJSONEnv .env', t => {
        t.deepEqual(readJSONEnv('ENV_JSON_VALUE'), { 'first': ['one', 2], 'second': null })
    })

    test.serial('readEnv .env.local', t => {
        t.is(readEnv('ENV_LOCAL_VALUE'), 'hello town!')
    })

    test.serial('readJSONEnv .env.local', t => {
        t.deepEqual(readJSONEnv('ENV_LOCAL_JSON_VALUE'), { '1': ['one', 2], '2': null })
    })

    test.serial('readEnv overwrite', t => {
        t.is(readEnv('ENV_VALUE_OVERWRITTEN'), 'overwritten!')
    })

    test.serial('readJSONEnv overwrite', t => {
        t.deepEqual(readJSONEnv('ENV_JSON_VALUE_OVERWRITTEN'), { 'done': '!' })
    })

    test.serial('readConf', t => {
        t.is(readConf('another', 'ANOTHER_VALUE'), 'config value')
    })

    test.serial('readJSONConf', t => {
        t.deepEqual(readJSONConf('test-package', 'TEST_VALUE'), { 'hello': 1, 'hugs': [null, 'true', false] })
    })

    test.serial('absolutePath', t => {
        t.is(absolutePath('some/relative/path'), __dirname+'/some/relative/path')
        t.is(absolutePath('/some/absolute/path'), '/some/absolute/path')
    })

    test.serial('onConfigChanged new config file', async t => {
        await new Promise(async (resolve, reject) => {
            onConfigChanged(() => resolve())
            await fs.promises.writeFile(absolutePath('config/new.ini'), '')
            setTimeout(() => reject(), 1000)
        })
            .then(() => t.pass())
            .catch(() => t.fail())
        await fs.promises.unlink(absolutePath('config/new.ini')).catch(() => {})
    })


// TODO: removed config file!!!
    test.serial('onConfigChanged touched .env file', getTestOnConfigChangedForFile('.env'))

    test.serial('onConfigChanged touched .env.local file', getTestOnConfigChangedForFile('.env.local'))

    test.serial('onConfigChanged touched config file', getTestOnConfigChangedForFile('config/another.ini'))

    test.serial('isDevEnv', t => {
        t.is(isDevEnv(), false)
        setTimeout(() => process.exit(), 100)
    })
})

function getTestOnConfigChangedForFile(fileName) {
    return async t => {
        await new Promise(async (resolve, reject) => {
            onConfigChanged(() => resolve())
            await fs.promises.writeFile(
                absolutePath(fileName),
                await fs.promises.readFile(absolutePath(fileName))
            )
            setTimeout(() => reject(), 1000)
        })
            .then(() => t.pass())
            .catch(() => t.fail())
    }
}
