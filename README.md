# Testing CRUD Operations with Express and Express-Validator

This project is a sandbox to organize and run tests for simple CRUD (Create, Read, Update, Delete) application using `express`, `body-parser`, and `express-validator`. It also includes testing using `supertest` and `jest`. JSON file reader to simulate CRUD operations on a database.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Potential Future Updates](#technologies-used)
- [References](#references)

## Prerequisites
- Node.js installed on your machine
- npm (Node Package Manager)

## Getting Started

### Dependencies

* express: minimalist web framework for Node

* express-validator: Express middleware for validating and sanitizing

* body-parser: Node body parsing middleware

* supertest: Library for testing Node HTTP servers

* jest: Testing framework


### Installation
1. Install the dependencies:
```
npm i
```

2. For Handling Jest in ES Modules
https://jestjs.io/docs/ecmascript-modules

## Running the Application

Run tests for all CRUD operations.
This project uses jest and supertest for testing.
```
npm test
```

### Example Tests
```
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

  // Add other tests similarly
})

```

## API Endpoints

### Add a New Book
- **URL:** `/books`
- **Method:** `POST`
- **Body Parameters:**
  - `title` (string, required, max length 100)
  - `author` (string, required, max length 50)
  - `isbn` (string, required, numeric, length 13, unique)
  - `publishedDate` (string, optional, ISO8601 format)
- **Responses:**
  - `201 Created` if the book is successfully added
  - `400 Bad Request` if validation fails

### Retrieve a List of Books
- **URL:** `/books`
- **Method:** `GET`
- **Responses:**
  - `200 OK` with the list of books

### Retrieve a Single Book by ISBN
- **URL:** `/books/:isbn`
- **Method:** `GET`
- **Responses:**
  - `200 OK` with the book details
  - `404 Not Found` if the book is not found

### Update an Existing Book by ISBN
- **URL:** `/books/:isbn`
- **Method:** `PUT`
- **Body Parameters:**
  - `title` (string, optional)
  - `author` (string, optional)
- **Responses:**
  - `200 OK` if the book is successfully updated
  - `404 Not Found` if the book is not found

### Delete a Book by ISBN
- **URL:** `/books/:isbn`
- **Method:** `DELETE`
- **Responses:**
  - `200 OK` if the book is successfully deleted
  - `404 Not Found` if the book is not found

## Potential Future Updates
* organize tests for each crud operation into separate files

* include `routes/` and `controllers/` directories
```
crud-test-systemt/
├── controllers/
│   └── books.js
├── data/
│   ├── books.json
│   ├── db.js
│   └── __mocks__/
│       └── db.js
├── routes/
│   └── books.js
├── tests/
│   ├── books.test.js
├── src/
│   └── index.js
├── package.json
├── .babelrc

```