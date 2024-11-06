import gplay from 'google-play-scraper';
import axios from 'axios';
import { Review } from '../models/reviewModel.js';

const fetchReviews = async function (appId, numberOfReviews) {
    try {
        const reviews = await gplay.reviews({
            appId,
            sort: gplay.sort.NEWEST,
            num: numberOfReviews || 5
        });

        return reviews.data;

    } catch (error) {
        console.log("Something went wrong while fetching reviews:", error);
        return [];
    }
};

export const categorizeAndSave = async function (appId, numOfReviews) {
    const reviews = await fetchReviews(appId, numOfReviews);

    for (let review of reviews) {
        try {
            const response = await axios.post(process.env.LLM_CHAT_URI, {
                model: "reviewer",
                messages: [
                    {
                        role: "user",
                        content: review.text
                    }
                ],
                stream: false
            });
            const category = response.data.message.content;

            const reviewDocument = await Review.create({
                reviewId: review.id,
                userName: review.userName,
                score: review.score,
                reviewDate: review.date,
                reviewUrl: review.url,
                reviewText: review.text,
                category,
            })
            // console.log(reviewDocument)
            // console.log(`Review: "${review.text}" \nCategory: ${category}\n`);

        } catch (error) {
            console.log("Error while categorizing", error);
        }
    }
};

