import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
dotenv.config();
import Users from '../models/users'

export default function secureRoute(req: Request, res: Response, next: NextFunction) {

    console.log("Hey! This is a secure route. Authorise access only!")

    // 0. is there a toke? If there is no token, reject.
    const rawToken = req.headers.authorization
    if (!rawToken) {
        return res.status(401).json({ message: "Unauthorised. No Auth header found." })
    }
    // 1. grab the jwt , unwrap it
    const token = rawToken.replace("Bearer ", "")

    // ! let's verify if this is a legit jwt(keyfob) and which user it is (via jwt payload)
    // ! jwt.vertify first argumentis the jwt token
    // ? the secret with which we had issued with the jwt (in jwt.sign method)
    // ? callback function which lets us check for errors (if any)

    // ! - in the callback we must specify two variables
    // ! - the first argument will be filled in with any errors 
    jwt.verify(token, process.env.JWT_SECRET as string, async (err, payload) => {
        if (err || !payload) {
            return res.status(401).json({ message: "Unathorised. Invalid JWT."})
        }
        
        console.log("Valid token! The payload is: ", payload)

        interface JWTPayload {
            userId: string
        }

        const jwtPayload = payload as JWTPayload
        const userId = jwtPayload.userId

        const user = await Users.findById(userId)
        if (!user) {
            return res.status(401).json({ message: "User not found. Invalid JWT!"})
        }
        
        // ? attach user info to the request object so that
        // ? our delte route handler (and other priviliged route handlers can)
        // ? make use of it 
        req.currentUser = user

        next() // the request moves on to the next middleware in the chain
    }) 
   

   
}