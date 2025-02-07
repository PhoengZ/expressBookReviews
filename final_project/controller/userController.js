import User from "../model/userModel.js";
import books from "../model/bookModel.js";
import jwt from "jsonwebtoken";

export async function loginUser(req,res){
    const {username,password} = req.body;
    console.log(`Attempting login for username: ${username}`);
    const id = await User.find({username:username});
    if (id.length != 0){
        console.log(`User found: ${id[0].username}`);
        if (id[0].password == password){
            let accessToken = jwt.sign({
                data: username
            }, 'access', { expiresIn: 60 });
        
            // Store access token in session
            req.session.authorization = {
                accessToken
            }
            res.status(200).json({message:"Complete login"});
        }else{
            res.status(500).json({message:"password's incorrect"});
        }
    }else{
        res.status(500).json({message:"Username's not found"})
    }
}
export async function regisUser(req,res){
    const {username,password} = req.body;
    let arr = [];
    const name =  await User.find({username:username});
    if (name.length == 0){
        const newUser = new User({
            username,
            password,
            arr
        });
        try{
            await newUser.save();
            res.status(200).json({message:"Complete create user!"});
        }catch(error){
            console.error(error);
            res.status(400).json({message:"Fail to save user!"});
        }
    }else{
        res.status(500).json({message:"Username is already exist"})
    }
    
}
export async function userReview(req,res) {
    let {username,cm,star} = req.body;
    star = Number(star);
    console.log(typeof(start));
    const isbn = req.params.isbn;
    const book = await books.find({ISBN:isbn});
    if (book.length != 0){
        const existingReviewIndex = book[0].reviews.findIndex(review => review.reviewer === username);
        const ob = {
            "reviewer":username,
            "comment":cm,
            "rating":star
        }
        if (existingReviewIndex !== -1) {
            book[0].reviews[existingReviewIndex] = ob;
        } else {
            book[0].reviews.push(ob); 
        }
        try{
            await book[0].save();
            res.status(200).json({message:"Complete adding review!"})
        }catch(error){
            console.error(error);
            res.status(500).json({message:"Eror to save new reviews"});
        }
    }else{
        res.status(500).json({message:"Not found a book"})
    }
}
export async function deleteReview(req,res) {
    const isbn = req.params.isbn;
    const {username} = req.body;
    const book = await books.find({ISBN:isbn});
    if (book.length != 0){
        book[0].reviews = book[0].reviews.filter(rev=>rev.reviewer != username);
        await book[0].save();
        res.status(200).json({message:"Delete successfull"});
    }else{
        res.status(500).json({message:"Book not found"})
    }
}
export async function logoutUser(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
}