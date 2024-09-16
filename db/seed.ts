import mongoose from "mongoose";
import Users from "../models/users";
import Actor from "../models/actors";
import Movie from "../models/movies";
import dotenv from 'dotenv';
dotenv.config();

// Define the admin user
const adminUser = { username: 'ws-bit', password: 'WSBITwsbit123!', confirmPassword: 'WSBITwsbit123!', email: 'wsbit@gmail.com' };

async function seed() {
  try {
    // Corrected the MongoDB URI connection
    console.log('Trying to connect!')
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected!')

    // Clear existing data
    await Movie.deleteMany();
    await Actor.deleteMany();
    await Users.deleteMany();

    // Create the admin user
    const user = await Users.create(adminUser);
    console.log('Created user: ', user)

    // Define actor data with reference to user ID
    const actorData = [
      {
        name: "Matthew McConaughey",
        image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSxecI0vIxtv6-XnvMuSnFffm1D7BqkIa-g413lLTpIbyA_5jng",
        user: user._id,
        movies: [],
      },
    ];

    const [actor] = await Actor.create(actorData);
    const actorId = actor._id;

    // Define movie data with reference to actor's ID
    const movieData = [
      {
        name: 'Interstellar',
        year: 2014,
        image: 'https://www.movieposters.com/cdn/shop/files/interstellar_593eaeff_480x.progressive.jpg?v=1698434355',
        user: user._id,
        actors: [actorId],
      },
    ];

    const [movie] = await Movie.create(movieData);

    // Update actor with movie ID
    await Actor.findByIdAndUpdate(actorId, { movies: [movie._id] }, { new: true });

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
