import request from 'supertest'
import app from '../src/index.js'
import { clear, __setMockData } from '../data/__mocks__/db.js' // mock data

describe('POST /books', () => {
  beforeEach(() => {
    clear() // clear books.json before each test
    __setMockData([])
  })

  it('should return 400 if title is missing', async () => {
    const response = await request(app)
      .post('/books')
      .send({ author: 'Author Name', isbn: '1234567890123' })

    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Title is required' })
    ]))
  })

  it('should return 400 if author is missing', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', isbn: '1234567890123' })

    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Author is required' })
    ]))
  })

  it('should return 400 if ISBN is missing', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', author: 'Author Name' })

    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'ISBN is required' })
    ]))
  })

  it('should return 400 if ISBN is not 13 characters', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', author: 'Author Name', isbn: '1234567890' })

    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'ISBN must be 13 characters' })
    ]))
  })

  it('should return 400 if ISBN is not numeric', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', author: 'Author Name', isbn: 'ABC4567890123' })

    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'ISBN must be a number' })
    ]))
  })

  it('should return 201 if title, author, ISBN, and publishedDate are provided and unique', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', author: 'Author Name', isbn: '1234567890123', publishedDate: '2023-07-16' })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Book created')
  })

  it('should return 400 if ISBN is not unique', async () => {
    __setMockData([{ title: 'Existing Book', author: 'Existing Author', isbn: '1234567890123' }])

    const response = await request(app)
      .post('/books')
      .send({ title: 'New Book', author: 'New Author', isbn: '1234567890123' })

    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'isbn must be unique' })
    ]))
  })

  it('should return 201 if publishedDate is valid ISO8601', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', author: 'Author Name', isbn: '1234567890123', publishedDate: '2023-07-16' })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Book created')
  })

  it('should return 400 if publishedDate is invalid', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', author: 'Author Name', isbn: '1234567890123', publishedDate: 'invalid-date' })

    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Published date must be ISO8601' })
    ]))
  })

  it('should return 201 if publishedDate is not provided', async () => {
    const response = await request(app)
      .post('/books')
      .send({ title: 'Book Title', author: 'Author Name', isbn: '1234567890123' })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Book created')
  })
})
