import fs from 'fs'
import path from 'path'

// https://www.geeksforgeeks.org/node-js-process-cwd-method/
// https://nodejs.org/api/path.html#path_path_join_paths
// get absolute path to data file
const dataFilePath = path.join(process.cwd(), 'data', 'books.json')

/**
 * Read data from file
 * Simulate CRUD operations: Read
 * @returns {Array} data
 */
const read = () => {
  try {
    const data = fs.readFileSync(dataFilePath)
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data:', error)
    return []
  }
}

/**
 * Write data to file
 * Simulate CRUD operations: Create, Update
 * @param {*} data 
 */
const write = data => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
    } catch (error) {
        console.error('Error writing data:', error)
    }
}

// clear data file
const clear = () => {
    write([])
}


export { read, write, clear }