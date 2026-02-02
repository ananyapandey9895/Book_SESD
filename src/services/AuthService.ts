import { User } from '../interfaces';

export class AuthService {
    private users: User[] = [];
    private currentUser: User | null = null;

    constructor() {
        this.seedUsers();
    }

    private seedUsers(): void {
        this.users.push({
            id: '1',
            username: 'admin',
            email: 'admin@library.com',
            role: 'admin',
            createdAt: new Date()
        });
        this.users.push({
            id: '2',
            username: 'user1',
            email: 'user1@library.com',
            role: 'user',
            createdAt: new Date()
        });
    }

    login(username: string): User | null {
        const user = this.users.find(u => u.username === username);
        if (user) {
            this.currentUser = user;
            return user;
        }
        return null;
    }

    logout(): void {
        this.currentUser = null;
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    isAdmin(): boolean {
        return this.currentUser?.role === 'admin';
    }

    canBorrowBooks(): boolean {
        return this.isAuthenticated();
    }

    canManageBooks(): boolean {
        return this.isAdmin();
    }

    createUser(username: string, email: string, role: 'admin' | 'user' = 'user'): User {
        const newUser: User = {
            id: (this.users.length + 1).toString(),
            username,
            email,
            role,
            createdAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    getAllUsers(): User[] {
        return [...this.users];
    }
}