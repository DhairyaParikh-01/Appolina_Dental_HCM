const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {default: User} = require('../Models/user');
const Users = require('../Models/user');
require('dotenv').config();
const router = express.Router();


// let JWT_SECRET = "ThisIsJWTSecret";
// ROUTE 1: To authenticate user using sign up using http POST operation at 'api/auth/signup'. ==> TESTED OK

router.post('/signup', async(req,res) => {
    let success = false;
    try
    {
        let user  = await Users.findOne({email: req.body.email});
        if(user){
            success = false;
            return res.status(400).json({success, error: "a user with this email address already exists, please sign in!"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user = await Users.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const jwtToken = jwt.sign(data, process.env.JWT_SECRET);
        console.log(jwtToken);
        user.save();
        success = true;
        res.json({success, jwtToken});
    }
    catch(error){
        console.error(error.message);
        success = false;
        res.status(500).send("Internal Server Error: " + error);
    }
});

// ROUTE 2: To authenticate but logging in user using http POST operation at 'api/auth/signin'. ==> TESTED OK

router.post('/signin', async(req,res) => {
    let success = false;
    try{
        const {email, password} = req.body;
        // let user = await Users.findOne({email});
        let user = await Users.findOne({email}).select("+password");

        if(!user){
            success = false;
            return res.status(400).json({success, error: "Invalid credentials"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success, error: "Invalid credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const jwtToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({success ,jwtToken});
    }
    catch(error){
        console.error(error.message);
        success = false;
        res.status(500).send("Internal Server Error: " + error);
    }
});

module.exports = router;