import Movies from '../models/movies';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// ! Get all movies
export const indexMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movies.find();
    console.log('Obtained these from db:', movies);
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ! Get movie by ID
export const getMovieById = async (req: Request, res: Response) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.movieId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // ! .populate grabs the data and shows data from multiple db
    const movie = await Movies.findById(req.params.movieId).populate({
      path: 'actors',
      populate: {
          path: 'user'
      }
  }).populate('user') 

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    console.log('Fetched movie:', movie);
    res.status(200).json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ! Post new movie
export const postMovie = async (req: Request, res: Response) => {
  console.log('Post request from user', req.currentUser);

  try {
    // ! Assign the current user's ID to the new movie
    req.body.user = req.currentUser._id;
    const newMovie = req.body;

    // ! Log incoming data for debugging
    console.log('USER HAS SENT US:', newMovie);

    // ! Create and save the new movie
    const savedMovie = await Movies.create(newMovie);
    console.log('JUST ADDED:', savedMovie);

    // ! Return the created movie as a response
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error posting a movie:', error);
    res.status(500).json({ message: 'Internal server error, did you enter the required info?' });
  }
};



// ! Update a movie
export const updateMovie = async (req: Request, res: Response) => {
  console.log("Update request from user", req.currentUser); 
  const { id: movieId } = req.params;

  // Check if the provided movieId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // Find the movie by ID
    const movie = await Movies.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the current user is the owner of the movie
    const movieOwner = movie.user;
    console.log('The movie you\'re trying to update is owned by:', movieOwner);

    if (!req.currentUser || !req.currentUser._id.equals(movieOwner)) {
      return res.status(403).json({ message: 'You are not authorized to update this movie.' });
    }

    console.log('USER HAS EDITED:', movie, 'WITH:', req.body);

    // Update the movie with new data
    Object.assign(movie, req.body);
    const updatedMovie = await movie.save();

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Internal server error, did you provide the required info and use a correct ID?' });
  }
};

// ! Delete a movie
export const deleteMovie = async (req: Request, res: Response) => {
  console.log('Delete request from user', req.currentUser); 

  const { id: movieId } = req.params;

  // Check if the provided movieId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // Find the movie by ID
    const movieDoc = await Movies.findById(movieId);
    if (!movieDoc) {
      return res.status(404).json({ message: "The movie you're trying to delete is not found." });
    }

    const movieOwner = movieDoc.user;
    console.log('The movie you\'re trying to delete is owned by:', movieOwner);

    // Check if the current user is the owner of the movie
    if (!req.currentUser || !req.currentUser._id.equals(movieOwner)) {
      return res.status(403).json({ message: 'You are not authorized to delete this movie.' });
    }

    // Delete the movie
    const deletedMovie = await Movies.findByIdAndDelete(movieId);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie successfully deleted', movie: deletedMovie });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'An error occurred while deleting the movie' });
  }
};


