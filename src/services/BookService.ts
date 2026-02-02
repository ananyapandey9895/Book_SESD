import { Book } from '../models/Book';
import { BookRepository } from '../repositories/BookRepository';
import { BookValidator, ValidationError } from '../validators/BookValidator';
import { IBook, BookFilters, SortOptions, PaginationOptions, BookSearchResult } from '../interfaces';

export class BookService {
    private repository: BookRepository;

    constructor() {
        this.repository = new BookRepository();
    }

    create(title: string, author: string, isbn: string, publishedYear: number, genre: string, description?: string, rating?: number): Book {
        BookValidator.validateTitle(title);
        BookValidator.validateAuthor(author);
        BookValidator.validateISBN(isbn);
        BookValidator.validateYear(publishedYear);
        BookValidator.validateGenre(genre);
        BookValidator.validateRating(rating);

        const existingBook = this.repository.findAll().find(b => b.isbn === isbn);
        if (existingBook) {
            throw new ValidationError('A book with this ISBN already exists');
        }

        const book = new Book(title, author, isbn, publishedYear, genre, description, rating);
        return this.repository.save(book);
    }

    getAll(): Book[] {
        return this.repository.findAll();
    }

    getById(id: string): Book | null {
        if (!id || id.trim().length === 0) {
            throw new ValidationError('Book ID is required');
        }
        return this.repository.findById(id);
    }

    getByTitle(title: string): Book[] {
        if (!title || title.trim().length === 0) {
            throw new ValidationError('Title is required for search');
        }
        return this.repository.findByTitle(title);
    }

    getByAuthor(author: string): Book[] {
        if (!author || author.trim().length === 0) {
            throw new ValidationError('Author is required for search');
        }
        return this.repository.findByAuthor(author);
    }

    getByGenre(genre: string): Book[] {
        return this.repository.findByGenre(genre);
    }

    update(id: string, updates: Partial<IBook>): Book | null {
        if (!id || id.trim().length === 0) {
            throw new ValidationError('Book ID is required');
        }

        if (updates.title) BookValidator.validateTitle(updates.title);
        if (updates.author) BookValidator.validateAuthor(updates.author);
        if (updates.isbn) BookValidator.validateISBN(updates.isbn);
        if (updates.publishedYear) BookValidator.validateYear(updates.publishedYear);
        if (updates.genre) BookValidator.validateGenre(updates.genre);
        if (updates.rating) BookValidator.validateRating(updates.rating);

        return this.repository.update(id, updates);
    }

    delete(id: string): boolean {
        if (!id || id.trim().length === 0) {
            throw new ValidationError('Book ID is required');
        }
        return this.repository.delete(id);
    }

    searchBooks(filters: BookFilters, sort?: SortOptions, pagination?: PaginationOptions): BookSearchResult {
        let books = this.repository.findWithFilters(filters);

        if (sort) {
            books = this.repository.sortBooks(books, sort);
        }

        if (pagination) {
            BookValidator.validatePagination(pagination.page, pagination.limit);
            const result = this.repository.paginateBooks(books, pagination);
            return {
                books: result.books,
                total: result.total,
                page: pagination.page,
                totalPages: result.totalPages
            };
        }

        return {
            books,
            total: books.length,
            page: 1,
            totalPages: 1
        };
    }

    getAvailableBooks(): Book[] {
        return this.repository.findAvailable();
    }

    getBorrowedBooks(): Book[] {
        return this.repository.findBorrowed();
    }

    getOverdueBooks(): Book[] {
        return this.repository.findOverdueBooks();
    }

    borrowBook(id: string, userId: string): boolean {
        const book = this.getById(id);
        if (!book) {
            throw new ValidationError('Book not found');
        }
        if (!book.available) {
            throw new ValidationError('Book is not available for borrowing');
        }
        return book.borrow(userId);
    }

    returnBook(id: string): boolean {
        const book = this.getById(id);
        if (!book) {
            throw new ValidationError('Book not found');
        }
        if (book.available) {
            throw new ValidationError('Book was not borrowed');
        }
        return book.returnBook();
    }

    rateBook(id: string, rating: number): boolean {
        BookValidator.validateRating(rating);
        const book = this.getById(id);
        if (!book) {
            throw new ValidationError('Book not found');
        }
        book.setRating(rating);
        return true;
    }

    getGenres(): string[] {
        return this.repository.getGenres();
    }

    getAuthors(): string[] {
        return this.repository.getAuthors();
    }

    getStatistics() {
        return this.repository.getStatistics();
    }

    getPopularBooks(limit: number = 10): Book[] {
        return this.repository.findAll()
            .filter(book => book.rating && book.rating >= 4)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
    }

    getRecentBooks(limit: number = 10): Book[] {
        return this.repository.findAll()
            .sort((a, b) => b.publishedYear - a.publishedYear)
            .slice(0, limit);
    }
}