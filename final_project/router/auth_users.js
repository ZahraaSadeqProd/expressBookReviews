const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
        
        req.session.accessToken = token;

        return res.status(200).json({ message: "User successfully logged in", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    
    if (!req.session || !req.session.accessToken) {
        return res.status(401).json({ message: "Unauthorized: Please login first" });
    }
    jwt.verify(req.session.accessToken, "fingerprint_customer", (err, decoded) => {
        const username = decoded.username;
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        if (!books[isbn]) {
            return res.status(404).json({ message: `No book with ISBN ${isbn} found` });
        }
        books[isbn].reviews = books[isbn].reviews || {};
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: `Review added/updated for book ${isbn}`, reviews: books[isbn].reviews });
    });
});

// Delete a book review
regd_users.delete("/auth/review/d:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!req.session || !req.session.accessToken) {
        return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    jwt.verify(req.session.accessToken, "fingerprint_customer", (err, decoded) => {
        const username = decoded.username;
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        if (!books[isbn]) {
            return res.status(404).json({ message: `No book with ISBN ${isbn} found` });
        }
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: `Review deleted for book ${isbn}`, reviews: books[isbn].reviews });
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
