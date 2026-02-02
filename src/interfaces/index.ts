export interface IBook {
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
    getInfo(): string;
    getDetailedInfo(): string;
}

export interface BookFilters {
    genre?: string;
    author?: string;
    available?: boolean;
    yearFrom?: number;
    yearTo?: number;
    rating?: number;
}

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface SortOptions {
    field: keyof Omit<IBook, 'getInfo' | 'getDetailedInfo'>;
    order: 'asc' | 'desc';
}

export interface BookSearchResult {
    books: IBook[];
    total: number;
    page: number;
    totalPages: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: Date;
}