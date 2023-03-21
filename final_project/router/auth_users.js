const session = require('express-session')
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = 'mySecretKey';


let users = [
  {
    username: 'john',
    password: 'password123'
  },
  {
    username: 'jane',
    password: 'securePassword'
  }
];

// regd_users.use(session({
//   secret: 'mySessionSecret',
//   resave: false,
//   saveUninitialized: false
// }));
regd_users.use(session({secret:"fingerpint"}));


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  
  // check if username and password are provided
  (!username || !password) && res.status(400).json({ message: "Username and password are required"});

  const existingUser = users.find(user => user.username === username);
  
  // check if user exists
  (!existingUser) && res.status(401).json({message: "Invalid username or password!"});

  // check if password is correct
  (existingUser.password !== password) && res.status(401).json({message: "Invalid username or password"});
  
  // create a JWT token for the session
  const token = jwt.sign({ username: existingUser.username}, secretKey, {expiresIn: "1h"});

  return res.status(200).json({ message: 'Login successful', token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const { username } = req.session;

  (!review) && res.status(400).json({ message: 'Review is required' });

  const reviews = Object.entries(books[req.params.isbn].reviews);
  // Object.values(books)
  // Object.entries(books)
  const existingReview = reviews.find(review => review.username === username && review.isbn === req.params.isbn);

  if (existingReview) {
    // modify existing review
    existingReview.review = review;
    return res.status(200).json({ message: 'Review modified successfully' });
  } else {
    // add new review
    const newReview = {
      isbn: req.params.isbn,
      username: username,
      review: review
    };
    reviews.push(newReview);
    return res.status(201).json({ message: 'Review added successfully', review: review });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session;
  const book = books[req.params.isbn];

  (!book) && res.status(404).json({ message: "Book not found" });
  
  // Get the reviews for the book
  const reviews = Object.entries(book.reviews);
  // Find the review by the current user
  const reviewIndex = reviews.findIndex(([key, review]) => review.username === username );
  // if review does not belong to current user
  (reviewIndex === -1) && res.status(404).json({ message: "Review not found" });
  // Remove the review
  reviews.splice(reviewIndex, 1);

  book.reviews = Object.fromEntries(reviews);

  return res.status(200).json({ message: "Review deleted successfully" });
});






module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
