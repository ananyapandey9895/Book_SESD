export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class BookValidator {
    static validateTitle(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new ValidationError('Title is required');
        }
        if (title.length > 200) {
            throw new ValidationError('Title must be less than 200 characters');
        }
    }

    static validateAuthor(author: string): void {
        if (!author || author.trim().length === 0) {
            throw new ValidationError('Author is required');
        }
        if (author.length > 100) {
            throw new ValidationError('Author name must be less than 100 characters');
        }
    }

    static validateISBN(isbn: string): void {
        if (!isbn || isbn.trim().length === 0) {
            throw new ValidationError('ISBN is required');
        }
        const cleanISBN = isbn.replace(/[-\s]/g, '');
        if (!/^\d{10}(\d{3})?$/.test(cleanISBN)) {
            throw new ValidationError('Invalid ISBN format');
        }
    }

    static validateYear(year: number): void {
        const currentYear = new Date().getFullYear();
        if (!year || year < 1000 || year > currentYear + 1) {
            throw new ValidationError(`Year must be between 1000 and ${currentYear + 1}`);
        }
    }

    static validateGenre(genre: string): void {
        if (!genre || genre.trim().length === 0) {
            throw new ValidationError('Genre is required');
        }
        if (genre.length > 50) {
            throw new ValidationError('Genre must be less than 50 characters');
        }
    }

    static validateRating(rating?: number): void {
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            throw new ValidationError('Rating must be between 1 and 5');
        }
    }

    static validatePagination(page: number, limit: number): void {
        if (page < 1) {
            throw new ValidationError('Page must be greater than 0');
        }
        if (limit < 1 || limit > 100) {
            throw new ValidationError('Limit must be between 1 and 100');
        }
    }
}