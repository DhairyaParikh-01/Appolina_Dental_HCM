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