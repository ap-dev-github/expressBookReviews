const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
const foundusername=users.filter((user)=>{ return user.username===username});
if(foundusername.length>0){
    return true;
}
else{
    return false;
}
}

const authenticatedUser = (username,password)=>{
    let filteredUser=users.filter((user)=>{return (user.username===username&&user.password===password)});
    if(filteredUser.length>0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 const username=req.body.username;
 const password=req.body.uername;
 if(!username ||!password){
     return res.status(400),json({message:"Invalid Input "}) 
 }
 else{
     if(authenticatedUser(username,password)){
         let accessToken=jwt.sign({data:password},'access',{expiresIn:60*60});
         req.session.authorization={accessToken,username};
         return res.status(200).json({message:"Login Successful!"});
     }
     else{
         return res.status(401).json({message:"Invalid username or password"});
     }
 }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
