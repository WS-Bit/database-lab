// seed.js
import mongoose from "mongoose";
import Users from "../models/users";

async function seed() {
  try {
    await mongoose.connect('mongodb+srv://wsbit:TgddWCWRFODtWF5E@ws-bit-ga-cluster.jaigq.mongodb.net/christmas-movies?retryWrites=true&w=majority&appName=WS-Bit-GA-Cluster');
    
    // ! Define the users
    const seededUsers = [
      { username: 'admin', password: 'adminpass', email: 'admin@admin.com' },
    ];

    // ! Insert users
    await Users.insertMany(seededUsers);

    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
