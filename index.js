const express = require('express');
const app = express();
const EmployeeRoutes = require('./api/employees');
const DepartmentRoutes = require('./api/departments');
const AuthRoutes = require('./api/auth');
const connect_to_mongo = require('./db_connection');
const cors = require("cors");
const port = 3000
require('dotenv').config();




connect_to_mongo();

// app.get('/', (req, res) => {
//   res.send('Hello World! this is to test verel deployments')
// })


app.use(express.json());

// Implementing code to enable CORS for our frontend application:

app.use(cors({
  origin: process.env.CORS_BASE_URL, // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "auth-token"],
  credentials: true
}));

// API Routes for an http server
app.use('/api/auth', require('./api/auth'));
app.use('/api/employees', require('./api/employees'));
app.use('/api/departments', require('./api/departments'));

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app;