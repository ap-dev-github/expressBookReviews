const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

let booksarray = Object.values(books);

const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let newusername = req.body.username;
    let newpassword = req.body.password;
    if (!newusername || !newpassword) {
        return res.status(400).json({ message: "Invalid Input" });
    }
    else {
        foundusername = users.filter((user) => user.username === newusername)

        if (foundusername.length > 0) {
            return res.status(400).json({ message: "Username already exist!" })
        }
        else {
            users.push({ username: newusername, password: newpassword });

        }
        return res.status(200).json({ message: "Registration Successful !" });


    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        return res.status(200).json({ message: "These are the books available right now", books });
    }
    catch (error) {
        console.log("Error fectching the book list");
        res.status(500).json({ message: "Internal Server Error" });

    }
});





// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];//we will use axios to acces the book data if we use any data or external api but here we already have the book objet so we dont need axios async alone enough.
        if (!book) {
            return res.status(404).json({ message: "Book not found!" })
        }
        else {
            return res.status(200).json({ message: "The book details with entered isbn number:", book })
        }
    }
    catch (error) {
        return res.status(422).json({ message: "Internal Server Error" })
    }
});





// Get book details based on author

public_users.get('/author/:author', async (req, res) => {
    try {
        let booksarray = Object.values(books);//to use the filter propery which works on an array convery books object ot an array first the use it.
        const author = req.params.author;
        if (author) {
            const foundbook = booksarray.filter(book => book.author === author)
            if (foundbook.length > 0) {
                return res.status(200).json({ message: "Books are listed below", foundbook })
            }
            else {
                res.status(404).json({ message: "No book found in Shop!" })
            }

        }

        else {
            return res.status(400).json({ message: "Invalid Request ! Check url properly." })
        }
    }
    catch (error) {
        return res.status(422).json({ message: "Internal Server Error" })
    }
});




// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        if (title) {
            const foundbook = booksarray.filter((book) => book.title === title)
            if (foundbook.length > 0) {
                return res.status(200).json({ message: "The books found are listed Below:-", foundbook })
            }
            else {
                return res.status(404).json({ message: "Book Not found" })
            }
        }
        else {
            return res.status(400).json({ message: "Invalid Title Input" })
        }
    }
    catch (error) {
        return res.status(422).json({ message: "Internal Sever Error" });
    }
});



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        const foundbook = books[isbn];
        if (books[isbn]) {
            res.send(foundbook["reviews"]);
        }
        else {
            return res.status(404).json({ message: "No book Found with  this isbn" });
        }
    }
    else {
        return res.status(400).json({ message: "No isbn Provided" })
    }
}

);



module.exports.general = public_users;
