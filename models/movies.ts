// * This file is responsible for defining your own model (type) for your data (movie)
import mongoose from 'mongoose'



// ! Make a schema (structuer for the data)

const reviewSchema = new mongoose.Schema({
    text: { type: String, required: true},
    stars: { type: Number, required: true, min: 1, max: 5},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
})

const movieSchema = new mongoose.Schema({ 
    name: { type: String, required: true},
    year: { type: Number, required: true},
    image: { type: String, required: true},
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
    // ? every movie added must belong to a user in the DB
    // ! This controls the movies having actor Id's
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] // !better way
    reviews: [reviewSchema]

})

// ! We export our scheme as a new model using mongoose's .model method
// ! We export the compiled model to make it available to other files
// ? Specify the collection name. First character Uppercase. Singular.
// ? Second argument is the scheme we just made

export default mongoose.model("Movie", movieSchema) 