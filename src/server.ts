import express from 'express';
import { BookController } from './controllers/BookController';

const app = express();
const PORT = 4000;
const controller = new BookController();

app.use(express.json());

app.get('/books', (req, res) => {
    const result = controller.listAllBooks();
    res.json({ books: result });
});

app.post('/books', (req, res) => {
    const { title, author, isbn, publishedYear, genre } = req.body;
    const result = controller.addBook(title, author, isbn, publishedYear, genre);
    res.json({ message: result });
});

app.get('/books/:id', (req, res) => {
    const result = controller.findBook(req.params.id);
    res.json({ book: result });
});

app.delete('/books/:id', (req, res) => {
    const result = controller.removeBook(req.params.id);
    res.json({ message: result });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    controller.login("admin");
    controller.addBook("The Great Gatsby", "F. Scott Fitzgerald", "978-0-7432-7356-5", 1925, "Fiction");
    controller.addBook("1984", "George Orwell", "978-0-452-28423-4", 1949, "Dystopian");
});