import mongoose from 'mongoose'

// ! Make a schema (structuer for the data)

const actorSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    // movies: { type: String, required: true },
    image: { type: String, required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    // ? every actor added must belong to a user in the DB
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }

})

export default mongoose.model("Actor", actorSchema) 