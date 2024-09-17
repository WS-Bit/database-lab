import express from 'express';

const router = express.Router();
import { indexMovies, getMovieById, postMovie, updateMovie, deleteMovie } from '../controllers/movieController';
import { indexActors, getActorById, postActor, updateActor, deleteActor } from '../controllers/actorController';
import { signUp, login } from '../controllers/userController';
import { createReview, deleteReview, updateReview } from '../controllers/reviewsController';
import secureRoute from '../middleware/secureRoute';
import sanitizeRoute from '../middleware/sanatizeRoute';

// Routes
router
.route('/signup')
.post(signUp);

router
.route('/login')
.post(login);

router
.route('/movies')
.get(indexMovies)
.post(sanitizeRoute, secureRoute, postMovie);

router
.route('/movies/:movieId')
.put(sanitizeRoute, secureRoute, updateMovie)
.get(getMovieById)
.delete(sanitizeRoute, secureRoute, deleteMovie);


router
.route('/actors')
.get(indexActors)
.post(sanitizeRoute, secureRoute, postActor);

router
.route('/actors/:actorId')
.get(getActorById)
.put(sanitizeRoute, secureRoute, updateActor)
.delete(sanitizeRoute, secureRoute, deleteActor);

router
.route('/movies/:movieId/reviews')
.post(sanitizeRoute, secureRoute, createReview);

router
.route('/movies/:movieId/reviews/:reviewId')
.put(sanitizeRoute, secureRoute, updateReview)
.delete(sanitizeRoute, secureRoute, deleteReview);

export default router;