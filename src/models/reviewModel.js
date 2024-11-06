import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    reviewId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        trim: true
    },
    reviewDate: {
        type: Date,
        required: true
    },
    reviewUrl: {
        type: String,
        requried: true
    },
    score: {
        type: Number
    },
    reviewText: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Bugs', 'Complaints', 'Crashes', 'Praises', 'Other'],
        default: 'Other'
    }
}, { timestamps: true })

export const Review = new mongoose.model('Review', reviewSchema)
