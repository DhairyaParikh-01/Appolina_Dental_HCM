const jwt = require('jsonwebtoken');
require('dotenv').config();


// Middleware TESTED OK

const authenticateUser = ((req,res,next) => {
    const token = req.header('auth-token');

    if(!token){
        res.status(401).send("Authentication required! Please signin");
    }
    try{
        const data = jwt.verify(token,process.env.JWT_SECRET) // JWT secret to be moved to local environment variables enable the below line and disable this line before moving to prod env
        // const data = jwt.verify(token, "JWTSeceret"); 
        req.user = data.user;
        next();
    } 
    catch (error) {
        console.error(error.message);
        res.status(401).send({error: "Invalid auth token"});
    }
});

module.exports = authenticateUser;