import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookies from "../utils/generateTokens.js";

const signup = async (req, res) => {
    try {
        const {fullname, username, password} = req.body

        if (!fullname || !username || !password) {
            return res.status(400).json("Plaese enter the required credientials");
        }

        const alreadyUser = await User.findOne({
            username: req.body.username
        })

        if(alreadyUser){
            return res.status(400).json({error:"Username already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullname,
            username,
            password: hashedPassword,
        })

        generateTokenAndSetCookies(user._id, res);
        await user.save();

        return res
        .status(200)
        .json(user)

    } catch (error) {
        console.log("Error in signup controller", error);
        throw error;
    }
}

const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"})
        }

        generateTokenAndSetCookies(user._id, res);

        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in login controller", error);
        throw error;
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        return res.status(200).json({
            message:"Logout successfully",
        })
    } catch (error) {
        console.log("Error in logout controller", error);
        throw error;
    }
}

const getAllUsers = async(req, res) => {
    try {
        const currentUserId = req.user._id;

        const users = await User.find({ _id: { $ne: currentUserId } }).select("-username -friends -password");

        return res.status(200).json(users);
    } catch (error) {
        console.log("Error in logout controller", error);
        throw error;
    }
}

export {
    signup,
    login,
    logout,
    getAllUsers
}