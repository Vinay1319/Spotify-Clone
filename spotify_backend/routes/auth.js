const express = require("express");
const router = express.Router(); //to perform get,post methods etc
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

router.post("/register", async (req, res) => {
        // this code runs when /register api is called as a POST request
        // my req.body will be of the format {email,password,firstName,lastName,username}
        const { email, password, firstName, lastName, username } = req.body;

        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(403).json({ error: "A user with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserData = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            username,
        };
        const newUser = await User.create(newUserData);

        // creating a token to return to the user
        const token = await getToken(email, newUser);
        
        const userToReturn = { ...newUser.toJSON(), token };
        delete userToReturn.password; // doesn't return the hashed password to the user
        return res.status(200).json(userToReturn);
}); // to register user

router.post("/login", async (req,res) => {
    //get email and password sent by user from req.body
    const {email, password} = req.body;

    //check if a user with the given email exists. If not, the credentials are invalid.
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(403).json({err: "Invalid credentials"});
    }
    //if user exists, check if the password is correct. If not, the credentials are invalid.
    //brcypt.compare enabled us to compare 1 password in plaintext(password from req.body) to a hashed password(the one in our db) securely.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // this will be true or false.
    if(!isPasswordValid){
        return res.status(403).json({err: "Invalid credentials"});
    }

    //if credentials are correct, return a token to the user.
    const token = await getToken(user.email, user);
    const userToReturn = { ...user.toJSON(), token };
        delete userToReturn.password; // doesn't return the hashed password to the user
        return res.status(200).json(userToReturn);
});

module.exports = router;
