import Actor from '../models/actors';
import { Request, Response } from 'express';
import mongoose from 'mongoose';


// ! Getting all actors

export const indexActors = async (req: Request, res: Response) => {
    try {
      const actors = await Actor.find();
      console.log('Obtained these from db:', actors);
      res.status(200).json(actors);
    } catch (error) {
      console.error('Error fetching actors:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// ! Get actor by ID

export const getActorById = async (req: Request, res: Response) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.actorId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    try {
      // ! .populate grabs the data and shows data from multiple db
      const actor = await Actor.findById(req.params.actorId)
  
      if (!actor) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      console.log('Fetched actor:', actor);
      res.status(200).json(actor);
    } catch (error) {
      console.error('Error fetching actor:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// ! Post new actor

export const postActor = async (req: Request, res: Response) => {
  console.log('Post request from user', req.currentUser); 

  try {
    // ! Assign the current user's ID to the new movie
    req.body.user = req.currentUser._id;
    const actor = req.body;

    // ! Log incoming data for debugging
    console.log('USER HAS SENT US:', actor);

    // ! Create and save the new movie
    const savedActor = await Actor.create(actor);
    console.log('JUST ADDED:', savedActor);

    // ! Return the created movie as a response
    res.status(201).json(savedActor);
  } catch (error) {
    console.error('Error posting an actor:', error);
    res.status(500).json({ message: 'Internal server error, did you enter the required info?' });
  }
};

// ! Update an actor

export const updateActor = async (req: Request, res: Response) => {
    console.log("Update request from user", req.currentUser);
  
    // Check if the provided actorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.actorId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    try {
      // Find the actor by ID
      const actor = await Actor.findById(req.params.actorId);
      if (!actor) {
        return res.status(404).json({ message: 'Actor not found' });
      }
  
      // Check if the current user is the owner of the actor info
      const actorOwner = actor.user;
      console.log('The movie you\'re trying to update is owned by:', actorOwner);
  
      if (!req.currentUser || !req.currentUser._id.equals(actorOwner)) {
        return res.status(403).json({ message: 'You are not authorized to update this movie.' });
      }
  
      console.log('USER HAS EDITED:', actor, 'WITH:', req.body);
  
      // Update the actor with new data
      Object.assign(actor, req.body);
      const updatedActor = await actor.save();
  
      res.status(200).json(updatedActor);
    } catch (error) {
      console.error('Error updating actor:', error);
      res.status(500).json({ message: 'Internal server error, did you provide the required info and use a correct ID?' });
    }
  };


  // ! Delete an actor
export const deleteActor = async (req: Request, res: Response) => {
    console.log('Delete request from user', req.currentUser); 
  
    const { id: actorId } = req.params;
  
    // Check if the provided movieId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(actorId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    try {
      // Find the movie by ID
      const actorDoc = await Actor.findById(actorId);
      if (!actorDoc) {
        return res.status(404).json({ message: "The movie you're trying to delete is not found." });
      }
  
      const actorOwner = actorDoc.user;
      console.log('The movie you\'re trying to delete is owned by:', actorOwner);
  
      // Check if the current user is the owner of the movie
      if (!req.currentUser || !req.currentUser._id.equals(actorOwner)) {
        return res.status(403).json({ message: 'You are not authorized to delete this actor.' });
      }
  
      // Delete the movie
      const deletedActor = await Actor.findByIdAndDelete(actorId);
      if (!deletedActor) {
        return res.status(404).json({ message: 'Actor not found' });
      }
  
      res.status(200).json({ message: 'Actor successfully deleted', movie: deleteActor });
    } catch (error) {
      console.error('Error deleting actor:', error);
      res.status(500).json({ message: 'An error occurred while deleting the actor' });
    }
  };