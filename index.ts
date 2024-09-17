import express from 'express';
import mongoose from 'mongoose';
import { indexMovies, getMovieById, postMovie, updateMovie, deleteMovie } from './controllers/movieController';
import { indexActors, getActorById, postActor, updateActor, deleteActor } from './controllers/actorController';
import { signUp, login } from './controllers/userController';
import { createReview, deleteReview, updateReview } from './controllers/reviewsController';
import secureRoute from './middleware/secureRoute';
import sanitizeRoute from './middleware/sanatizeRoute';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const router = express.Router();

// Middleware
app.use(express.json());
// TODO app.use(mongoSanitize()); // Sanitize data

// Routes
router.route('/api/signup').post(signUp);
router.route('/api/login').post(login);

router.route('/api/movies').get(indexMovies);
router.route('/api/movies').post(sanitizeRoute, secureRoute, postMovie);
router.route('/api/movies/:movieId').put(sanitizeRoute, secureRoute, updateMovie);
router.route('/api/movies/:movieId').get(getMovieById);
router.route('/api/movies/:movieId').delete(sanitizeRoute, secureRoute, deleteMovie);

router.route('/api/actors').get(indexActors);                  
router.route('/api/actors').post(sanitizeRoute, secureRoute, postActor);      
router.route('/api/actors/:actorId').get(getActorById);        
router.route('/api/actors/:actorId').put(sanitizeRoute, secureRoute, updateActor);  
router.route('/api/actors/:actorId').delete(sanitizeRoute, secureRoute, deleteActor); 

router.route('/api/movies/:movieId/reviews').post(sanitizeRoute, secureRoute, createReview)
router.route('/api/movies/:movieId/reviews/:reviewId').put(sanitizeRoute, secureRoute, updateReview)
router.route('/api/movies/:movieId/reviews/:reviewId').delete(sanitizeRoute, secureRoute, deleteReview)

app.use(router);

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
