const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

    const response = await new Promise((resolve, reject) => {
        resolve({ data: books });
    });
    return res.status(200).json({ message: JSON.stringify(response.data, null, 4) });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    console.log(isbn);
    const response = await new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve({ data: books[isbn] });
        } else {
            reject(new Error(`Book with ISBN ${isbn} not found`));
        }
    });
    return res.status(200).json({ message: JSON.stringify(response.data, null, 4) });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const response = await new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        let authorBooks = {}; 

        bookKeys.forEach((isbn) => {
            if (books[isbn].author.toLowerCase() === authorName.toLowerCase()) {
                authorBooks[isbn] = books[isbn];
            }
        });

        if (Object.keys(authorBooks).length > 0) {
            resolve({ data: authorBooks });
        } else {
            reject(new Error(`No books found by author '${authorName}'`));
        }
    });

    return res.status(300).json({ message: JSON.stringify(response.data, null, 4) });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
