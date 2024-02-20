import { readJson, updateJson } from "./fileUtils.js";

const sendReponse = (code, body = null) => {
    const response = {
        code,
        body,
    };

    switch (code) {
        case 200:
            response.msg = "Ok";
            break;
        case 400:
            response.msg = "Endpoint not valid";
            break;
        case 401:
            response.msg = "The book already exists";
            break;
        case 404:
            response.msg = "Not found";
            break;
        case 500:
            response.msg = "Internal Server Error";
            break;
        default:
            response.msg = "Unknown status code";
    }

    return response;
}

const getBook = (endpoint) => {
    try {
        if (!endpoint) {
            return sendReponse(400);
        }

        const books = readJson('books.json');

        const result = books.find((book) => book.title === endpoint || book.ISBN === endpoint);

        if (result) {
            return sendReponse(200, 'The book exists');
        }

        return sendReponse(404);
    } catch (error) {
        return sendReponse(500, error);
    }
}

const getBooks = () => {
    try {
        const books = readJson("books.json")
        if (!books) {
            return sendReponse(404, "There´s no books");
        }
        return sendReponse(200, books);
    } catch (error) {
        return sendReponse(500, error);
    }
}

const addBook = (title, ISBN, year, genre, author, stock, publisher) => {
    try {
        const books = readJson("books.json");

        const newBook = {
            title,
            ISBN,
            year,
            genre,
            author,
            stock,
            publisher
        }

        const empty = Object.values(newBook).some(element => element === undefined);
        console.log(empty);

        if (empty) {
            return sendReponse(400, "All fields are required");
        }

        const repeat = books.some((book) => book.ISBN === newBook.ISBN);

        if (repeat) {
            return sendReponse(401);
        }

        const newBooks = [...books, newBook];

        updateJson(newBooks, "books-test.json");

        return sendReponse(
            200,
            "The book " + newBook.title + " was appended to books. " + newBooks
        );
    } catch (error) {
        return sendReponse(500, error);
    }
}

const removeBookByTitleOrISBN = (endpoint) => {
    try {
        const books = readJson("books.json");

        if (!endpoint) {
            return sendReponse(400);
        }

        const index = books.findIndex(book => book.ISBN === endpoint || book.title === endpoint);

        if (index > 0) {
            const bookDeleted = books.splice(index, 1);
            updateJson(books, "books-test.json");
            return sendReponse(200, bookDeleted);

        }

        return sendReponse(404);
    } catch (error) {
        return sendReponse(500, error);
    }
}

function filterBy(property, type) {
    try {
        const books = readJson("books.json");
        if (
            !property ||
            !type ||
            (property !== "genre" &&
                property !== "author" &&
                property !== "publisher")
        ) {
            return sendReponse(400);
        }

        const booksBy = books.filter((book) => book[property] === type);
        if (booksBy.length > 0) {
            updateJson(booksBy, "books-test.json");
            return sendReponse(200, booksBy);
        }

        return sendReponse(404);
    } catch (error) {
        return sendReponse(500, error);
    }
}

function listBooks() {
    try {
        const books = readJson("books.json");

        if (!books || books.length === 0) {
            sendReponse(404, "There´s no books");
        }

        const arrayBooks = [];

        for (const book of books) {
            const string = `${book.title} - ${book.author} - ${book.year}`;
            arrayBooks.push(string);
        }
        updateJson
            (arrayBooks, "books-test.json");
        return sendReponse(200, arrayBooks);
    } catch (error) {
        return sendReponse(500, error);
    }
}

function getBooksByYear(year) {
    try {
        year = parseInt(year);
        const books = readJson("books.json");
        if (!year) {
            return sendReponse(400);
        }

        const booksByYear = books.filter((book) => book.year === year);

        if (booksByYear.length > 0) {
            updateJson(booksByYear, "books-test.json");
            return sendReponse(200, booksByYear);
        }

        return sendReponse(404);
    } catch (error) {
        return sendReponse(500, error);
    }
}

const genreFullAvailability = (genre) => {
    try {
        const books = readJson("books.json");

        if (!genre) {
            return sendReponse(400);
        }

        const booksGenre = books.filter((book) => book.genre === genre);
        const result = booksGenre.every((book) => book.stock > 0);

        if (result) {
            updateJson(booksGenre, "books-test.json")
            return sendReponse(200, true);
        }

        return sendReponse(404, false);
    } catch (error) {
        return sendReponse(500, error);
    }
}

const genrePartialAvailability = (genre) => {
    try {
        const books = readJson("books.json");

        if (!genre) {
            return sendReponse(400);
        }

        const booksGenre = books.filter((book) => book.genre === genre);
        const result = booksGenre.some((book) => book.stock > 0);

        if (result) {
            updateJson(booksGenre, "books-test.js")
            return sendReponse(200, true);
        }

        return sendReponse(404, false);
    } catch (error) {
        return sendReponse(500, error);
    }
}

const getCountBy = (property) => {
    try {
        const books = readJson("books.json");

        if (property !== "genre" && property !== "author" && property !== "publisher") {
            return sendReponse(400);
        }

        let counter = books.reduce((acc, book) => {
            acc[book[property]] = (acc[book[property]] || 0) + 1;
            return acc;
        }, {});

        updateJson(counter, "books-test.json");
        return sendReponse(200, counter);
    } catch (error) {
        return sendReponse(500, error);

    }
}

function main() {
    const args = process.argv.slice(2);

    const endpoint = args[0];

    switch (endpoint) {
        case 'getBook':
            const titleOrISBN = args[1];
            console.log(getBook(titleOrISBN));
            break;
        case 'getBooks':
            console.log(getBooks());
            break;
        case 'addBook':
            const title = args[1];
            const ISBN = args[2];
            const year = args[3];
            const genre = args[4];
            const author = args[5];
            const stock = args[6];
            const publisher = args[7];
            console.log(addBook(title, ISBN, year, genre, author, stock, publisher));
            break;
        case "removeBookByTitleOrISBN":
            const titleOrISBNRemove = args[1];
            console.log(removeBookByTitleOrISBN(titleOrISBNRemove));
            break;
        case "filterBy":
            const property = args[1];
            const type = args[2];
            console.log(filterBy(property, type));
            break;
        case "listBooks":
            console.log(listBooks());
            break;
        case "getBooksByYear":
            const yearGet = args[1];
            console.log(getBooksByYear(yearGet));
            break;
        case "genreFullAvailability":
            const genreFull = args[1];
            console.log(genreFullAvailability(genreFull));
            break;
        case "genrePartialAvailability":
            const genrePartial = args[1];
            console.log(genrePartialAvailability(genrePartial));
            break;
        case "getCountBy":
            const propertyCounter = args[1];
            console.log(getCountBy(propertyCounter));
            break;
        default:
            console.log("Function no valid");
            break;
    }
}

main();


