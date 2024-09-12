import express from 'express';
import mongoose from 'mongoose';
import { indexMovies, getMovieById, postMovie, updateMovie, deleteMovie } from './controllers/movieController';
import { signUp, login } from './controllers/userController';
import secureRoute from './middleware/secureRoute';
import mongoSanitize from 'express-mongo-sanitize'; // Uncommented
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const router = express.Router();

// Middleware
app.use(express.json());
app.use(mongoSanitize()); // Sanitize data

// Routes
router.route('/api/movies').get(indexMovies);
router.route('/api/movies').post(secureRoute, postMovie);
router.route('/api/movies/:id').put(secureRoute, updateMovie);
router.route('/api/movies/:id').get(getMovieById);
router.route('/api/movies/:id').delete(secureRoute, deleteMovie);
router.route('/api/signup').post(signUp);
router.route('/api/login').post(login);

app.use(router); // Register routes

// Start the server
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to the database');
    
    app.listen(8020, () => {
      console.log('Express API is running on http://localhost:8020');
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

start();
