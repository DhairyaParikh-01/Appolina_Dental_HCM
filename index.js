const express = require('express');
const app = express();
const EmployeeRoutes = require('./api/employees');
const DepartmentRoutes = require('./api/departments');
const AuthRoutes = require('./api/auth');
const connect_to_mongo = require('./db_connection');
const port = 3000
require('dotenv').config();




connect_to_mongo();

app.get('/', (req, res) => {
  res.send('Hello World! this is to test verel deployments')
})


app.use(express.json());
// API Routes for an http server
app.use('/api/auth', AuthRoutes);
app.use('/api/employees', EmployeeRoutes);
app.use('/api/departments', DepartmentRoutes);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


module.exports = app;