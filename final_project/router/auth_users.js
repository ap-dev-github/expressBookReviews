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

const authenticatedUser=(username,password)=>{
    let filteredUser=users.filter((user)=>{
      return (user.username===username&&user.password===password)

    })
    if(filteredUser.length>0){
     return true;
    }
    else{
      return false;
    }
  }

//only registered users can login
regd_users.post("/login",(req,res)=>{
    const username= req.body.username;
    const password=req.body.password;
  
    if(!username||!password){
     return  res.status(402).json({message:"Invalid Creditials"})
    }
    else{
      if(authenticatedUser(username,password)){
        let accessToken=jwt.sign({data:password},'access',{expiresIn:60*60});
        req.session.authorization={accessToken,username}
       return  res.status(200).json({message:"User successfully logged in"})
      }
      else{
        return res.status(404).json({message:"Invalid Login. Check username or password"})
      }
      
  
    }
  })

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 const isbn=req.params.isbn;
 const username = req.session.authorization.username;
 let foundbook=books[isbn];

 if(foundbook){
 const reviewText=req.query.review;
 if(!foundbook.reviews){
     foundbook.reviews=[];
 }
  foundbook.reviews.push({username,review:reviewText})
 return res.status(200).json({ message: "Review added successfully" });
}
else{
return res.status(404).json({message:"No Book with this ISBN !"})
}
});

regd_users.delete("/auth/delete/:isbn",(req,res)=>{
    const isbn=req.params.isbn;
    const currentusername=req.session.authorization.username;
    const foundbook=books[isbn];
    if(books[isbn]){
    const foundreview=foundbook.reviews.filter((user)=>{(user.username!=currentusername)})
   foundbook.reviews.push(foundreview);
   if(foundreview.length<foundbook.reviews.length){
       foundbook.reviews=foundreview;
       
   }
   return res.status(200).json({message:"Review deleted successfully !"})
    }
    else{
        return res.status(404).json({message:"Book not found"})
    }
      
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
