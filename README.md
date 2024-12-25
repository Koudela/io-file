# io-file

```
!!! Experimental repository - do not use in production !!!
```

A configurable and loggable wrapper to some node:fs functionality for basic file and extended file-data handling.

## install

```bash
npm install io-file
```

## configuration

```bash
$ tree
 . 
 ├── node_modules
 │    ...
 ├── config 
 │    ...
 │    └── io-file.ini
 ...
```

```
DEFAULT_READ_OPTIONS={"encoding":"utf8"}
DEFAULT_FILE_OPTIONS={"encoding":"utf8","mode":0o664}
DEFAULT_DIR_OPTIONS={"recursive":true,"mode":0o775}
LOG_DIR=path/to/your/log/directory
LOG_TYPE=all
ERROR_HANDLING=all
DATA_DIR=path/to/your/file/data/directory
VERSIONED_TABLE_IDENTIFIERS=["someIdentifier","anotherIdentifier"]
```


`DEFAULT_READ_OPTIONS` see https://nodejs.org/docs/latest/api/fs.html#filehandlereadfileoptions for details

`DEFAULT_FILE_OPTIONS` see https://nodejs.org/docs/latest/api/fs.html#filehandlewritefiledata-options for details

`DEFAULT_DIR_OPTIONS` see https://nodejs.org/docs/latest/api/fs.html#fspromisesmkdirpath-options for details

`LOG_DIR` is the path to the log directory. If it does not start with `/` it is calculated from the project root. 

`LOG_TYPE` can be `all`, `console` or `file`. Determines whether to use a log file the `console.log` functionality or both.

Please note that the duration logged for the reads and writes can be a lot above the duration used by the operating system. This is due to the internal processing of async code in node.

`ERROR_HANDLING` can be `all`, `log`, `throw`. Determines whether an error will be logged, thrown or both.

`DATA_DIR` is the path to the data directory. It is used by the table functions.

`VERSIONED_TABLE_IDENTIFIERS` determines if a data table should use versioning. If a table name (path) contains an identifier it is treated as versioned by the table functions.

## basic functionality

```js
doesExist(absolutePath)
```
Checks if a directory/file exists asynchronously. Returns a boolean.

```js
requirePathExists(absolutePath)
```
Checks if a directory exists and creates it if not asynchronously. Returns the path.

```js
makePath(absolutePath)
```
Creates a directory asynchronously. Returns the path.

```js
removePath(absolutePath)
```
Recursively removes a directory or a file asynchronously. A second parameter can be passed to alter the behaviour. See `fs.promises.rm` for details.

## basic file functionality

The `*SingletonFile` functions don't provide any atomic constraints. On concurrent writes it can destroy your files content due to indeterministic behaviour!

```js
readSingletonFile(absoluteFilePath)
```
Reads from a file asynchronously. Returns a string or `null` if there is no such file.

```js
writeSingletonFile(absoluteFilePath, dataString)
```
Writes a file with the dataString as content asynchronously. If the directory does not exist the function creates it.

```js
removeSingletonFile(absoluteFilePath)
```
Removes a file asynchronously. Returns true on success and `null` if there is no such file.

The `*BasicFile` functions do provide an atomic constraint. They do so by using the `fs.promises.rename` functionality. Thus, if there are concurrent writes the one who finishes last wins.

```js
readBasicFile(absoluteFilePath)
```
Reads from a file asynchronously. Returns a string or `null` if there is no such file.

```js
writeBasicFile(absoluteFilePath, dataString)
```
Writes a file with the dataString as content asynchronously. If the directory does not exist the function creates it.

```js
removeBasicFile(absoluteFilePath)
```
Removes a file asynchronously. Returns true on success and `null` if there is no such file.

```js
appendFile(absoluteFilePath, dataString)
```
Appends a dataString to a files content asynchronously. If the directory/file does not exist the function creates it. It does not provide any atomic constrain. Although nodes `fs.promises.appendFile` function seems to be atomic at least on linux machines.

## versioned file functionality

The `*VersionedFile` functions provide versioning of files. The versioned files are named with the current iso date an underscore and an uuid. The most recent versioned file is linked to the provided filename.

```js
readVersionedFile(absolutePath, fileName, fileNameExtension)
```
Reads from a (versioned) file asynchronously. Returns a string or `null` if there is no such file. Tries to recover from the existing versions if the linked file is missing.


```js
writeVersionedFile(absolutePath, fileName, fileNameExtension, dataString)
```
Writes a (versioned) file with the dataString as content asynchronously. If the directory does not exist the function creates it.

## data functionality

```js
calcAbsoluteTablePath(tableName)
```
Returns the path where the table entries are stored.

```js
tableDataExists(tableName, id)
```
Checks whether there is any data stored in the table entry asynchronously.

```js
readFromTable(tableName, id)
```
Returns the stored table entry or null if there is no data stored asynchronously.

```js
writeToTable(tableName, id, data)
```
Writes data to a table entry asynchronously.

```js
removeFromTable(tableName, id)
```
Removes a table entry asynchronously.

```js
allTableIds(tableName)
```
Returns an array of all ids associated with a table entry asynchronously.

## exposed inner functionality

```js
log(callback, logAssets, fileName)
```
Executes the callback and returns the result. Checks the `LOG_TYPE` settings and logs the logAssest together with the execution time to the specified output. If an error occurs the error is handled according to the `ERROR_HANDLING` settings.

```js
readOptions()
```
Returns the `DEFAULT_READ_OPTIONS` settings.

```js
fileOptions()
```
Returns the `DEFAULT_FILE_OPTIONS` settings.

```js
dirOptions()
```
Returns the `DEFAULT_DIR_OPTIONS` settings.
