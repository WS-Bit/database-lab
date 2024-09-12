// * This file is responsible for defining your own model (type) for your data (movie)

import mongoose from 'mongoose'

// ! Make a schema (structuer for the data)

const movieSchema = new mongoose.Schema({ 
    name: { type: String, required: true},
    year: { type: Number, required: true},
    genre: { type: String },
    image: { type: String, required: true},
})

// ! We export our scheme as a new model using mongoose's .model method
// ! We export the compiled model to make it available to other files
// ? Specify the collection name. First character Uppercase. Singular.
// ? Second argument is the scheme we just made

export default mongoose.model("Movie", movieSchema) 