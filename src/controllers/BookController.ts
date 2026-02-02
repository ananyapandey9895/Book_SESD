import { BookService } from '../services/BookService';
import { AuthService } from '../services/AuthService';
import { Book } from '../models/Book';
import { ValidationError } from '../validators/BookValidator';
import { BookFilters } from '../interfaces';

export class BookController {
    private bookService: BookService;
    private authService: AuthService;

    constructor() {
        this.bookService = new BookService();
        this.authService = new AuthService();
    }

    login(username: string): string {
        const user = this.authService.login(username);
        if (!user) {
            return 'Invalid username. Available users: admin, user1';
        }
        return `Welcome ${user.username}! You are logged in as ${user.role}.`;
    }

    logout(): string {
        this.authService.logout();
        return 'Logged out successfully.';
    }

    addBook(title: string, author: string, isbn: string, publishedYear: number, genre: string, description?: string, rating?: number): string {
        try {
            if (!this.authService.canManageBooks()) {
                return 'Access denied. Admin privileges required.';
            }

            const book = this.bookService.create(title, author, isbn, publishedYear, genre, description, rating);
            return `Book added successfully: ${book.getInfo()}`;
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Validation error: ${error.message}`;
            }
            return `Error adding book: ${error}`;
        }
    }

    listAllBooks(page?: number, limit?: number): string {
        try {
            if (page && limit) {
                const result = this.bookService.searchBooks({}, undefined, { page, limit });
                if (result.books.length === 0) {
                    return 'No books found.';
                }
                let output = result.books.map(book => 
                    `ID: ${book.id} | ${(book as Book).getDetailedInfo()} | Available: ${book.available ? 'Yes' : 'No'}`
                ).join('\n');
                output += `\n\nPage ${result.page} of ${result.totalPages} (${result.total} total books)`;
                return output;
            } else {
                const books = this.bookService.getAll();
                if (books.length === 0) {
                    return 'No books in the library.';
                }
                return books.map(book => 
                    `ID: ${book.id} | ${book.getDetailedInfo()} | Available: ${book.available ? 'Yes' : 'No'}`
                ).join('\n');
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error listing books: ${error}`;
        }
    }

    findBook(id: string): string {
        try {
            const book = this.bookService.getById(id);
            if (!book) {
                return 'Book not found.';
            }

            let info = `Found: ${book.getDetailedInfo()} | ISBN: ${book.isbn} | Available: ${book.available ? 'Yes' : 'No'}`;
            if (!book.available && book.borrowedBy) {
                info += ` | Borrowed by: ${book.borrowedBy}`;
                if (book.borrowedDate) {
                    info += ` | Borrowed on: ${book.borrowedDate.toDateString()}`;
                }
                const overdueDays = book.getDaysOverdue();
                if (overdueDays > 0) {
                    info += ` | OVERDUE by ${overdueDays} days`;
                }
            }
            return info;
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error finding book: ${error}`;
        }
    }

    searchByTitle(title: string): string {
        try {
            const books = this.bookService.getByTitle(title);
            if (books.length === 0) {
                return 'No books found with that title.';
            }
            return books.map(book => book.getDetailedInfo()).join('\n');
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error searching by title: ${error}`;
        }
    }

    searchByAuthor(author: string): string {
        try {
            const books = this.bookService.getByAuthor(author);
            if (books.length === 0) {
                return 'No books found by that author.';
            }
            return books.map(book => book.getDetailedInfo()).join('\n');
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error searching by author: ${error}`;
        }
    }

    updateBook(id: string, updates: any): string {
        try {
            if (!this.authService.canManageBooks()) {
                return 'Access denied. Admin privileges required.';
            }

            const updatedBook = this.bookService.update(id, updates);
            if (!updatedBook) {
                return 'Book not found.';
            }
            return `Book updated: ${updatedBook.getDetailedInfo()}`;
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Validation error: ${error.message}`;
            }
            return `Error updating book: ${error}`;
        }
    }

    removeBook(id: string): string {
        try {
            if (!this.authService.canManageBooks()) {
                return 'Access denied. Admin privileges required.';
            }

            const deleted = this.bookService.delete(id);
            if (!deleted) {
                return 'Book not found.';
            }
            return 'Book removed successfully.';
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error removing book: ${error}`;
        }
    }

    borrowBook(id: string): string {
        try {
            if (!this.authService.canBorrowBooks()) {
                return 'Please log in to borrow books.';
            }

            const currentUser = this.authService.getCurrentUser()!;
            this.bookService.borrowBook(id, currentUser.id);
            return 'Book borrowed successfully.';
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error borrowing book: ${error}`;
        }
    }

    returnBook(id: string): string {
        try {
            if (!this.authService.canBorrowBooks()) {
                return 'Please log in to return books.';
            }

            this.bookService.returnBook(id);
            return 'Book returned successfully.';
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error returning book: ${error}`;
        }
    }

    rateBook(id: string, rating: number): string {
        try {
            if (!this.authService.isAuthenticated()) {
                return 'Please log in to rate books.';
            }

            this.bookService.rateBook(id, rating);
            return `Book rated ${rating}/5 successfully.`;
        } catch (error) {
            if (error instanceof ValidationError) {
                return `Error: ${error.message}`;
            }
            return `Error rating book: ${error}`;
        }
    }

    listAvailableBooks(): string {
        const books = this.bookService.getAvailableBooks();
        if (books.length === 0) {
            return 'No books available.';
        }
        return books.map(book => book.getDetailedInfo()).join('\n');
    }

    getStatistics(): string {
        const stats = this.bookService.getStatistics();
        return `Library Statistics:\nTotal books: ${stats.total}\nAvailable: ${stats.available}\nBorrowed: ${stats.borrowed}\nOverdue: ${stats.overdue}`;
    }

    getPopularBooks(limit: number = 5): string {
        const books = this.bookService.getPopularBooks(limit);
        if (books.length === 0) {
            return 'No rated books available.';
        }
        return `Popular Books (Rating 4+):\n${books.map(book => book.getDetailedInfo()).join('\n')}`;
    }

    getGenres(): string {
        const genres = this.bookService.getGenres();
        return genres.length > 0 ? `Available genres: ${genres.join(', ')}` : 'No genres available.';
    }
}