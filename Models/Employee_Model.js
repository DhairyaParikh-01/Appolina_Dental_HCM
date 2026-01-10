const mongoose = require('mongoose')

// import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  // --- Personal Information ---
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    // Custom validator to ensure employee is at least 18
    validate: {
      validator: function(v) {
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
        return v <= minAgeDate;
      },
      message: 'Employee must be at least 18 years old.'
    },
  },

  // --- Contact Information (Embedded Document Example) ---
  contact: {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'], // Basic email regex validation
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be 10 digits.'],
    },
    address: {
      street: String,
      city: String,
      zipCode: String,
      country: {
        type: String,
        default: 'USA'
      }
    }
  },

  // --- Job/Employment Details ---
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department', // The model name we are referencing to Department
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    min: [0, 'Salary cannot be negative.'],
  },
  hireDate: {
    type: Date,
    default: Date.now,
  },
  // --- Soft Delete Flag ---
  deleted: {
    type: Boolean,
    default: false,
    select: false // Exclude from standard queries unless explicitly requested
  }

}, {
  // --- Schema Options ---
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  collection: 'employees' // Explicitly sets the collection name
});

// --- Virtual Property Example (Combines first and last name) ---
EmployeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;