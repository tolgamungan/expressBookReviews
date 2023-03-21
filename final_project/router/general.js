const axios = require('axios');
const express = require('express');
const public_users = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;


public_users.post('/register', function(req, res) {
  const { username, password } = req.body;
  // if (!username || !password) {
  //   return res.status(400).json({ message: 'Username and password are required' });
  // }
  (!username || !password) && res.status(400).json({ message: 'Username and password are required' });

  const existingUser = users.find(user => user.username === username);

 existingUser && res.status(409).json({ message: 'Username already exists' });

  const newUser = {
    username: username,
    password: password
  };
  users.push(newUser);
  return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify({books},null,4)); // formatting the output
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// using async-await with Axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    // const books = response.data;
    res.send(JSON.stringify({ books }, null, 4)); // formatting the output
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving book list' });
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = parseInt(req.params.isbn);
//   res.send(books[isbn]);
//   return res.status(300).json({message: "Yet to be implemented"});
//  });

 // using Promise callback with Axios 
 public_users.get('/isbn/:isbn', function(req, res) {
   const isbn = parseInt(req.params.isbn);
   axios.get('http://localhost:5000/isbn/' + isbn)
     .then(function(response) {
       res.send(response.data);
       res.status(300).json({ message: "Yet to be implemented" });
     })
     .catch(function(error) {
       res.status(500).json({ message: error.message });
     });
 });




// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author.toLowerCase();
//   // let filtered_author = books.filter((book) => book.author === author);
//   let filtered_author = Object.values(books).filter((book) => book.author.toLowerCase() === author);

//   res.send(filtered_author);
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Using async/await with axios
public_users.get('/author/:author', async function(req, res) {
  try {
    const author = req.params.author.toLowerCase();
    // let filtered_author = books.filter((book) => book.author === author);
    let filtered_author = Object.values(books).filter((book) => book.author.toLowerCase() === author);
    const response = await axios.get('http://localhost:5000/author/'+author);
    const booksByAuthor = response.data.filter((book) => book.author.toLowerCase() === author);
    res.send(booksByAuthor);
    res.status(300).json({ message: "Yet to be implemented" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const filtered_title = Object.values(books).filter(book => book.title.toLowerCase() === req.params.title.toLowerCase());
//   res.send(filtered_title);
//   return res.status(300).json({message: "Yet to be implemented"});
// });


// Using async/await with axios
public_users.get('/title/:title', async function(req, res) {
  try {
    const title = req.params.title.toLowerCase();
    const filtered_title = Object.values(books).filter(book => book.title.toLowerCase() === title);
    const response = await axios.get('http://localhost:5000/title/'+title);
    const bookByTitle = response.data.filter(book => book.title.toLowerCase() === title);
    res.send(bookByTitle);
    res.status(300).json({ message: "Yet to be implemented" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) { // if book and the review exists
    const reviews = Object.values(books[isbn].reviews);
    res.send(reviews);
  } else {
    res.status(404).send("Book not found or no reviews available.");
  }
});


module.exports.general = public_users;
