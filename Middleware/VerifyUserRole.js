/**
 * Middleware to verify user role(s)
 * Usage: verifyUserRole('admin') or verifyUserRole('admin', 'manager')
 * 
 * Middleware TESTED OK
 */
const jwt = require('jsonwebtoken');
const Users = require('../Models/user');
require('dotenv').config();


 const verifyUserRole = (...allowedRoles) => {
    return async (req, res, next) => {
      try {
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send("Authentication required!");
        }

        // Verifying JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetching User from DB
        const user = await Users.findById(decoded.user.id);
        // console.log(user);
        
        if (!user || user.deleted) {
            return res.status(401).json({
              message: 'Invalid or inactive user'
            });
          }


        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({
            message: 'Access denied. Insufficient permissions.'
          });
        }
  
        next();
      } catch (error) {
        return res.status(500).json({
          message: 'Role verification failed',
          error: error.message
        });
      }
    };
  };
  
module.exports = verifyUserRole;
  