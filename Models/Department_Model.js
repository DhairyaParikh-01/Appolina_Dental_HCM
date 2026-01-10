const mongoose = require('mongoose')

const DepartmentSchema = new mongoose.Schema(
    {
        DepartmentCode: {
            type: String,
            required: [true, 'Depatment code is required'],
            unique: true
        },

        DeparmentName: {
            type: String,
            required: [true, 'Department name is required'],
            trim: true
        },

        location: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
        collection: 'departments'
    }
);

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;