const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} User
 * @property {string} name - The user's name.
 * @property {string} email - The user's email.
 * @property {string} password - The user's hashed password.
 * @property {string} passwordConfirm - The user's password confirmation.
 * @property {string} photo - The user's photo URL.
 * @property {function} correctPassword - Compares a candidate password with the user's password.
 */


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true, 'Email already exists'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
        // validator: [validator.isStrongPassword, 'Please provide a strong password']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    passwordChangedAt: Date,
});


// pre save middleware to hash the password
UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});


/**
 * Compares a candidate password with the user's password.
 * @param {string} candidatePassword - The password to compare.
 * @param {string} userPassword - The user's hashed password.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
// instance method to compare password
UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// check if password was changed after token was issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp; // 100 < 200
    }

    // False means NOT changed
    return false;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;