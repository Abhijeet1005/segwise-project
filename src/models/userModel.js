import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

//Some hooks

userSchema.pre('save', async function (next) {
    //Checking if the pasword was modified on saving the document then we re-hash it, otherwise move on
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.checkPassword = async function (password) {
    const isCorrect = await bcrypt.compare(password, this.password)
    return isCorrect
}

userSchema.methods.generateAccessToken = function () {
    // console.log(process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY)
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)