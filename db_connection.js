const mongoose  = require('mongoose');
require('dotenv').config();


// Connection with mongoDB
const connect_to_mongo = async () => {
    try{
        // await mongoose.connect('mongodb+srv://dhairyaparikh1002_db_user:SHmWHCBXt0kSGhHQ@clusterbackeddb.t1wzium.mongodb.net/Apollonia_Dental_HCM?retryWrites=true&w=majority&appName=ClusterBackedDB');
        await mongoose.connect(`${process.env.MONGODB_URL}` , {family: 4});     //CODE TO BE ACTIVATED BEFORE MOVING TO PRODUCTION
        console.log("Connected to Mongo DB successflly!");
    } 
    catch(err){
        console.log(err);
    }
}

module.exports = connect_to_mongo;


// lib/mongo.js

/*
Refactored code to connect with MongoDB spcefically for serverless architrecture like Vercel-----------------------------------------
*/


// let cached = global._mongoose;

// if (!cached) {
//   cached = global._mongoose = { conn: null, promise: null };
// }

// const connect_to_mongo = async function connectDB() {
//     try{
//         if (cached.conn) return cached.conn;
      
//         if (!cached.promise) {
//           cached.promise = mongoose.connect(process.env.MONGODB_URL, {
//             bufferCommands: false,
//             maxPoolSize: 5,
//             family: 4
//           });
//         }
      
//         cached.conn = await cached.promise;
//         console.log("Connected to MongoDB Successfully!");
//         return cached.conn;
//     }
//     catch(err){
//         console.log(err);
//     }
// }

// module.exports = connect_to_mongo;