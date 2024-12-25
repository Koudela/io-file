# ini-config-loader

Lean `.env` and `config.ini` file loader with `0` dependencies.

## install

```bash
npm install ini-config-loader
```

## basic usage

```bash
$ tree
 . 
 ├── node_modules
 │    ...
 ├── config 
 │    ...
 │    └── my-module.ini
 ├── .env
 └── .env.local
```

```bash
const { 
    init, readEnv, readJSONEnv, readConf, readJSONConf 
} = require('ini-config-loader')

init().then(() => {
    const envValue = readEnv('EXAMPLE_ENV_VALUE')
    const envArrayValue = readJSONEnv('EXAMPLE_ENV_ARRAY'),
    const configValue = readConf('my-module', 'EXAMPLE_CONFIG_VALUE'),
    const configObjectValue = readJSONConf('my-module', 'EXAMPLE_CONFIG_OBJECT'),
})
```

## functionality

- [init](#init)


- [readEnv / readJSONEnv](#readenv--readjsonenv)
- [readConf / readJSONConf](#readconf--readjsonconf)


- [absolutePath](#absolutePath)
- [isDevEnv](#isDevEnv)
- [onConfigChanged](#onConfigChanged)


### init

`init` searches from the `node_modules` folder downwards the `.env` file. The folder with the `.env` file is the base directory. If there is no `.env` file the root directory (`/`) becomes the base directory. It loads the `.env` and the `.env.local` file from the base directory if present. It loads all `*.ini` files from the `config` folder above the base directory. It finishes when all files are parsed. 

On parsing the lines of a file are split on the first `=` and whitespace is trimmed off.

```  
   EXAMPLE_VAL = hello world!  #no comment
```

will be evaluated to something like this

```
{
    "EXAMPLE_VAL":"hello world!  #no comment"
}
```

Comments can be placed by not using an `=`.

```
This is an example value:  
EXAMPLE_VAL=hello world!
```

All values are string. The `readJSON*` functions apply `JSON.parse` to the value.

### readEnv / readJSONEnv

`readEnv(valueName)` returns a value defined in the `.env` or the `.env.local`.

If the value is defined in the `.env` and the `.env.local` the value of the `.env.local` is used.

If non such value is defined it returns `null`.

### readConf / readJSONConf

`readConf(moduleName, valueName)` returns a value defined in the `config/${moduleName}.ini`.

If non such value is defined it returns `null`.

### absolutePath

`absolutePath(relativePath)` prefixes a relative Path by the absolute path of the base directory. If the relative Path is an absolute Path (it starts with '/') it is not altered.

### isDevEnv

Checks whether the `readEnv('NODE_ENV')` value does not equal `production`. If it is not set, the `process.env.NODE_ENV` value is checked against.

### onConfigChanged

If `parseInt(readEnv('CONFIG_LOADER_TIMEOUT'))` evaluates to a positive integer it defines an intervall in milliseconds after which the `.env`, `.env.local` and `config/*.ini` files are checked for changes. If a change is detected all values are hot reloaded.

A callback which is registered by `onConfigChanged(callback)` is called after the reload has occurred.
