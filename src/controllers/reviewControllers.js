import { Review } from "../models/reviewModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper function to format the date to ISO string
const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0]; // returns 'YYYY-MM-DD' format
}

// Get reviews count for a specific category and day
export const getReviewCountsAndTrends = asyncHandler(async (req, res) => {
    const { category, date } = req.query;

    if (!category || !date) {
        throw new ApiError(400, "Category and Date are required.");
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const pastWeekReviews = await Review.find({
        reviewDate: { $gte: oneWeekAgo }
    })
    const reviewResponse = [{
        'Bugs': 0,
        'Complaints': 0,
        'Crashes': 0,
        'Praises': 0,
        'Other': 0,
    }, []]
    // console.log(pastWeekReviews)

    pastWeekReviews.forEach((review) => {
        reviewResponse[0][review.category] += 1
        if (review.category === category && review.reviewDate.toISOString().split('T')[0] === date) {
            reviewResponse[1].push(review)
        }
    })
    // console.log(reviewResponse)

    return res.status(200).json(
        new ApiResponse(200, "Review data fetched successfully", reviewResponse)
    );
});