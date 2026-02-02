import { BookController } from './controllers/BookController';

class LibraryApp {
    private controller: BookController;

    constructor() {
        this.controller = new BookController();
    }

    run(): void {
        console.log("Book Management System");

        console.log(this.controller.login("admin"));

        console.log(this.controller.addBook("The Great Gatsby", "F. Scott Fitzgerald", "978-0-7432-7356-5", 1925, "Fiction", "A classic American novel", 4.2));
        console.log(this.controller.addBook("To Kill a Mockingbird", "Harper Lee", "978-0-06-112008-4", 1960, "Fiction", "A gripping tale of racial injustice", 4.8));
        console.log(this.controller.addBook("1984", "George Orwell", "978-0-452-28423-4", 1949, "Dystopian", "A dystopian social science fiction novel", 4.5));
        console.log(this.controller.addBook("Clean Code", "Robert Martin", "978-0-13-235088-4", 2008, "Programming", "A handbook of agile software craftsmanship", 4.3));

        console.log("All Books:");
        console.log(this.controller.listAllBooks());

        console.log("Search by Author:");
        console.log(this.controller.searchByAuthor("George Orwell"));

        console.log("Available Books:");
        console.log(this.controller.listAvailableBooks());

        console.log("Popular Books:");
        console.log(this.controller.getPopularBooks());

        console.log("Library Statistics:");
        console.log(this.controller.getStatistics());

        const books = this.controller.listAllBooks().split('\n');
        if (books.length > 0) {
            const firstBookId = books[0].split(' | ')[0].replace('ID: ', '');
            console.log(`Borrowing Book ID: ${firstBookId}`);
            console.log(this.controller.borrowBook(firstBookId));

            console.log("Available Books After Borrowing:");
            console.log(this.controller.listAvailableBooks());

            console.log(`Returning Book ID: ${firstBookId}`);
            console.log(this.controller.returnBook(firstBookId));

            console.log(`Rating Book ID: ${firstBookId}`);
            console.log(this.controller.rateBook(firstBookId, 5));
        }

        console.log("Genres:");
        console.log(this.controller.getGenres());

        console.log("Paginated Books (Page 1, Limit 2):");
        console.log(this.controller.listAllBooks(1, 2));
    }
}

const app = new LibraryApp();
app.run();