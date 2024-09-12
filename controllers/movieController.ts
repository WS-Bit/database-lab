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
  const { movieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const movie = await Movies.findById(movieId);

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
  console.log("Post request from user", req.currentUser) // ! PENDING
  try {
    console.log('USER HAS SENT US:', req.body);
    const newMovie = req.body;

    const savedMovie = await Movies.create(newMovie);
    console.log('JUST ADDED:', savedMovie);

    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error posting a movie:', error);
    res.status(500).json({ message: 'Internal server error, did you enter the required info?' });
  }
};

// ! Update a movie
export const updateMovie = async (req: Request, res: Response) => {
  console.log("Update request from user", req.currentUser) // ! PENDING
  const { id: movieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const movie = await Movies.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    console.log('USER HAS EDITED:', movie, 'WITH:', req.body);

    Object.assign(movie, req.body);
    const updatedMovie = await movie.save();

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Internal server error, did you put the required info and use a correct id?' });
  }
};

// ! Delete a movie
export const deleteMovie = async (req: Request, res: Response) => {
  console.log("Delete request from user", req.currentUser) // ! PENDING
 
  const { id: movieId } = req.params;
  // if req.currentUser === owner of this movie, then delete movie
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
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
