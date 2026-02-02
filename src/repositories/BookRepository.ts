import { Book } from '../models/Book';
import { IBook, BookFilters, SortOptions, PaginationOptions } from '../interfaces';

export class BookRepository {
    private books: Book[] = [];

    save(book: Book): Book {
        this.books.push(book);
        return book;
    }

    findById(id: string): Book | null {
        return this.books.find(book => book.id === id) || null;
    }

    findAll(): Book[] {
        return [...this.books];
    }

    update(id: string, updates: Partial<IBook>): Book | null {
        const book = this.findById(id);
        if (!book) return null;

        Object.assign(book, updates);
        return book;
    }

    delete(id: string): boolean {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return false;

        this.books.splice(index, 1);
        return true;
    }

    findWithFilters(filters: BookFilters): Book[] {
        return this.books.filter(book => {
            if (filters.genre && book.genre.toLowerCase() !== filters.genre.toLowerCase()) {
                return false;
            }
            if (filters.author && !book.author.toLowerCase().includes(filters.author.toLowerCase())) {
                return false;
            }
            if (filters.available !== undefined && book.available !== filters.available) {
                return false;
            }
            if (filters.yearFrom && book.publishedYear < filters.yearFrom) {
                return false;
            }
            if (filters.yearTo && book.publishedYear > filters.yearTo) {
                return false;
            }
            if (filters.rating && book.rating && book.rating < filters.rating) {
                return false;
            }
            return true;
        });
    }

    findByTitle(title: string): Book[] {
        return this.books.filter(book => 
            book.title.toLowerCase().includes(title.toLowerCase())
        );
    }

    findByAuthor(author: string): Book[] {
        return this.books.filter(book => 
            book.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    findByGenre(genre: string): Book[] {
        return this.books.filter(book => 
            book.genre.toLowerCase() === genre.toLowerCase()
        );
    }

    findAvailable(): Book[] {
        return this.books.filter(book => book.available);
    }

    findBorrowed(): Book[] {
        return this.books.filter(book => !book.available);
    }

    findOverdueBooks(): Book[] {
        return this.books.filter(book => !book.available && book.getDaysOverdue() > 0);
    }

    sortBooks(books: Book[], sortOptions: SortOptions): Book[] {
        return books.sort((a, b) => {
            const aValue = a[sortOptions.field];
            const bValue = b[sortOptions.field];
            
            if (aValue === undefined || bValue === undefined) return 0;
            
            let comparison = 0;
            if (aValue < bValue) comparison = -1;
            if (aValue > bValue) comparison = 1;
            
            return sortOptions.order === 'desc' ? -comparison : comparison;
        });
    }

    paginateBooks(books: Book[], pagination: PaginationOptions): { books: Book[], total: number, totalPages: number } {
        const total = books.length;
        const totalPages = Math.ceil(total / pagination.limit);
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        
        return {
            books: books.slice(startIndex, endIndex),
            total,
            totalPages
        };
    }

    getGenres(): string[] {
        const genres = new Set(this.books.map(book => book.genre));
        return Array.from(genres).sort();
    }

    getAuthors(): string[] {
        const authors = new Set(this.books.map(book => book.author));
        return Array.from(authors).sort();
    }

    getStatistics() {
        const total = this.books.length;
        const available = this.books.filter(b => b.available).length;
        const borrowed = total - available;
        const overdue = this.findOverdueBooks().length;
        
        return { total, available, borrowed, overdue };
    }
}