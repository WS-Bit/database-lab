import { Request, Response } from "express";
import Movie from "../models/movies";
import movies from "../models/movies";


export async function createReview(req: Request, res: Response) {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        const newReview = { ...req.body, user: req.currentUser._id };

        movie.reviews.push(newReview);

        const updatedMovie = await movie.save();

        return res.status(201).json(updatedMovie);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}



export async function updateReview(req: Request, res: Response) {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        const review = movie.reviews.id(req.params.reviewId);

        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }

        // Check if the current user is the author of the review
        if (!review.user.equals(req.currentUser._id)) {
            return res.status(401).send({ message: "Unauthorized: you cannot update another user's review" });
        }

        // Update the review with the new data
        review.set(req.body);

        // Save the updated movie document, which contains the updated review
        const updatedMovie = await movie.save();

        // Return the updated review
        return res.status(200).json(updatedMovie);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}


export async function deleteReview(req: Request, res: Response) {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        const review = movie.reviews.id(req.params.reviewId);

        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }

        if (!review.user.equals(req.currentUser._id)) {
            return res.status(401).send({ message: "Unauthorized: you cannot delete another user's review" });
        }

        
        movie.reviews.pull(req.params.reviewId);

       
        const updatedMovie = await movie.save();

        return res.status(200).json(updatedMovie);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}
