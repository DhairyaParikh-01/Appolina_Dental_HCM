const mongoose = require('mongoose');
const {Schema} = mongoose

const UserSchema = new Schema({
    firstname : {
        type: String,
        required: true
    },
    lastname : {
        type: String
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true,
        select: false
    },
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    // Adding Avatar could be considered for the future enhancements:
    // avatar: {
    //     type: String // URL (S3 / Cloudinary / CDN)
    //   },
    date : {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

const user = new mongoose.model('user', UserSchema);
module.exports = user;