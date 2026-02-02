# Book Management System 📚

A simple library system built with TypeScript. You can add books, search for them, and track who borrowed what.

## What it does

- Add new books to your library
- Search books by title or author
- Update book information
- Delete books you don't need
- Let people borrow and return books
- See which books are available

## How to run it

### What you need first
- Node.js installed on your computer
- Basic knowledge of terminal/command line

### Getting started

1. **Download the code**
   ```bash
   git clone https://github.com/yourusername/book-management-system.git
   cd book-management-system
   ```

2. **Install what it needs**
   ```bash
   npm install
   ```

3. **Run the program**
   ```bash
   npm run dev
   ```

## How to use it

### Simple example

```typescript
import { BookController } from './controllers/BookController';

const library = new BookController();

// Add a book
library.addBook("Harry Potter", "J.K. Rowling", "123-456-789", 1997, "Fantasy");

// See all books
console.log(library.listAllBooks());

// Find books by an author
console.log(library.searchByAuthor("J.K. Rowling"));
```

### What you can do

| Function | What it does | What you need to give it |
|----------|--------------|---------------------------|
| `addBook()` | Add a new book | title, author, isbn, year, genre |
| `listAllBooks()` | Show all books | nothing |
| `searchByTitle()` | Find books by title | title to search for |
| `searchByAuthor()` | Find books by author | author name |
| `borrowBook()` | Mark a book as borrowed | book ID |
| `returnBook()` | Mark a book as returned | book ID |
| `removeBook()` | Delete a book | book ID |

## How it's organized

The code is split into 3 main parts:

- **Book.ts** - What a book looks like (title, author, etc.)
- **BookService.ts** - Does the actual work (adding, finding, deleting books)
- **BookController.ts** - Handles user requests and talks to BookService
- **main.ts** - Example of how to use everything

## Try the demo

Run `npm run dev` and you'll see:
1. Some sample books get added
2. All books are displayed
3. A search example
4. Someone borrowing and returning a book

## Commands you can use

- `npm run dev` - Run the program and see the demo
- `npm run build` - Prepare the code for production
- `npm start` - Run the built version


That's it! This is a learning project to understand TypeScript and object-oriented programming.
