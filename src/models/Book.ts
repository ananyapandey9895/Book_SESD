import { IBook } from '../interfaces';

export class Book implements IBook {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre: string;
    available: boolean;
    borrowedBy?: string;
    borrowedDate?: Date;
    rating?: number;
    description?: string;

    constructor(
        title: string, 
        author: string, 
        isbn: string, 
        publishedYear: number, 
        genre: string,
        description?: string,
        rating?: number
    ) {
        this.id = this.generateId();
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publishedYear = publishedYear;
        this.genre = genre;
        this.available = true;
        this.description = description;
        this.rating = rating;
    }

    private generateId(): string {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    getInfo(): string {
        return `${this.title} by ${this.author} (${this.publishedYear})`;
    }

    getDetailedInfo(): string {
        let info = this.getInfo();
        info += ` | Genre: ${this.genre}`;
        if (this.rating) {
            info += ` | Rating: ${this.rating}/5`;
        }
        if (this.description) {
            info += ` | ${this.description.substring(0, 50)}...`;
        }
        return info;
    }

    borrow(userId: string): boolean {
        if (!this.available) return false;
        this.available = false;
        this.borrowedBy = userId;
        this.borrowedDate = new Date();
        return true;
    }

    returnBook(): boolean {
        if (this.available) return false;
        this.available = true;
        this.borrowedBy = undefined;
        this.borrowedDate = undefined;
        return true;
    }

    setRating(rating: number): void {
        if (rating >= 1 && rating <= 5) {
            this.rating = rating;
        }
    }

    getDaysOverdue(): number {
        if (this.available || !this.borrowedDate) return 0;
        const daysBorrowed = Math.floor((Date.now() - this.borrowedDate.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, daysBorrowed - 14);
    }
}