import Users from '../models/users'; // Correct import
import { Request, Response } from 'express';
import { validatePassword } from '../models/users';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';



export const signUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Invalid user sign-up format. Username, email and password required' });
        }

        
        const savedUser = await Users.create(req.body);
        console.log('NEW SIGN-UP:', savedUser);

        res.status(201).json(savedUser);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
           
            // ! Handle Mongoose validation error
            console.error('Validation error:', error.message);
            return res.status(400).json({ message: 'Validation error' });
        } else if (error instanceof mongoose.Error) {
           
            // ! Handle other Mongoose errors
            console.error('Mongoose error:', error.message);
            return res.status(500).json({ message: 'Database error' });
        } else if (error instanceof Error) {
            
            // ! Check for MongoDB duplicate key error code (11000)
            if ((error as any).code === 11000) {
                console.error('Duplicate email error:', error.message);
                return res.status(409).json({ message: 'Email already in use' });
            }
            console.error('Error in sign-up process:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        //  ! Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        //  ! Find the user by email
        const foundUser = await Users.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ message: 'Login failed. User not found.' });
        }

        //  ! Validate the password
        const isValidPassword = validatePassword(password, foundUser.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Login failed. Incorrect password.' });
        }

        // ! Assign a token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment variables.');
          }
          
          const token = jwt.sign(
            { userId: foundUser._id, email: foundUser.email }, 
            process.env.JWT_SECRET,
            { expiresIn: '90d' }
          );
          
        // ! Respond with success
        return res.status(200).json({
            message: 'Login successful',
            user: {
                username: foundUser.username,
                email: foundUser.email,
            },
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

