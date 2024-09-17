import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protectedRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log("Token is", token);
    
        if (!token) {
           return res.status(401).json({error: "Unauthurized Personel - No Token Provided"}) 
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded is", decoded);
    
        if (!decoded) {
            return res.status(401).json({error: "Unauthurized Personel - Invalid Token"})
        }
    
        const user = await User.findById(decoded.userId).select("-password")
        // console.log("User is", user);
    
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }
    
        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute");
        throw error;
    }
}

export default protectedRoute;