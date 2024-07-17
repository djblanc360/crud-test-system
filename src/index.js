import express from 'express'
import bodyParser from 'body-parser'
import { check, validationResult } from 'express-validator'
import { read, write } from '../data/db.js'

const app = express()

app.use(bodyParser.json())

const router = express.Router()


/**
 * Dyanmic custom validator to check for unique values
 * Abstracted out to be reusable
 * @param {*} field 
 * @returns 
 */
const checkUnique = (field) => {
    return (value) => {
        const data = read()
        const isUnique = data.every((item) => item[field] !== value)
        
        if (!isUnique) {
            throw new Error(`${field} must be unique`)
        }
        return isUnique
    }
}

// add a new book
router.post(
  '/books',
  [
    check('title', 'Title is required').notEmpty(),
    check('title', 'Max length is 100 characters').isLength({ max: 100 }),
    check('author', 'Author is required').notEmpty(),
    check('author', 'Max length is 50 characters').isLength({ max: 50 }),
    check('author', 'Author must be unique').custom(value => checkUnique(value)),
    check('isbn', 'ISBN is required').notEmpty(),
    check('isbn', 'ISBN must be a number').isNumeric(),
    check('isbn', 'ISBN must be unique').custom(value => checkUnique(value)),
    check('isbn', 'ISBN must be 13 characters').isLength({ min: 13, max: 13 }),
    check('publishedDate', 'Published data is optional').optional(),
    check('publishedDate', 'Published date must be ISO8601').isISO8601(),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, author, isbn } = req.body
    const books = read()
    books.push({ title, author, isbn })
    write(books)

    res.status(201).json({ message: 'Book created' })
  }
)

// retrieve a list of books
router.get('/books', (req, res) => {
  const books = read()
  res.status(200).json(books)
})

// retrieve a single book by ISBN
router.get('books/:isbn', (req, res) => {
  const books = read()
  const book = books.find((book) => book.isbn === req.params.isbn)
  if (!book) {
    return res.status(404).json({ message: 'Book not found' })
  }
  res.status(200).json(book)
})

// update existing book by valid ISBN
router.put('/books/:isbn', (req, res) => {
  const books = read()
  const bookIndex = books.findIndex((book) => book.isbn === req.params.isbn)
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' })
  }

  const { title, author } = req.body
  books[bookIndex] = { ...books[bookIndex], title, author }
  write(books)

  res.status(200).json({ message: 'Book updated' })
})

// delete a book by valid ISBN
router.delete('/books/:isbn', (req, res) => {
  const books = read()
  const bookIndex = books.findIndex((book) => book.isbn === req.params.isbn)
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' })
  }

  books.splice(bookIndex, 1)
  write(books)

  res.status(200).json({ message: 'Book deleted' })
})

app.use('/', router)

export default app
