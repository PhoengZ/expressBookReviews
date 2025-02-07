import express from 'express';
import jwt from 'jsonwebtoken';
import * as userController from "../controller/userController.js";

const regd_users = express.Router();

regd_users.use("/review/:isbn", (req,res,next)=>{
  if(req.session.authorization){
    console.log("pass authorized first in auth_user");
    let token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      console.log("in jwt verify");
      if (!err) {        
          console.log("pass jwt");
          req.username = user; // Set authenticated user data on the request object
          next(); // Proceed to the next middleware
      } else {
          return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
      }
    });
  }
});

regd_users.post("/register",userController.regisUser);
regd_users.post("/login",userController.loginUser);
regd_users.post("/logout",userController.logoutUser);
regd_users.put("/review/:isbn",userController.userReview);
regd_users.delete("/review/:isbn",userController.deleteReview);


export default regd_users;
