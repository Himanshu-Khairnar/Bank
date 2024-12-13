import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pool } from "../Database.js"
import jwt from "jsonwebtoken"

const generateAccessToken = async (userId) => {
    try {
        const accessToken = user.generateAccessToken()
        const user = await pool.query("SELECT * FROM Users WHERE id = ?", [userId])
        jwt.sign({
            id: user[0].id,
            email: user[0].email,
            role: user[0].role,
            username: user[0].username
        }, process.env.ACCESSTOKEN_SECRET,
            {
                expiresIn: process.env.ACCESSTOKEN_EXPIRE
            })
        return { accessToken }
    }
    catch (error) {
        throw new ApiError(404, "Something went wrong while generating access token", error.message)
    }

}

export const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password)
            throw new ApiError(400, "All fields are required")


        const existingUser = await pool.query("SELECT * FROM Users WHERE email = ?", [email])

        if (existingUser[0].length > 0)
            throw new ApiError(400, "User already exists")

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)


        const user = await pool.query("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword])

        if (!user)
            throw new ApiError(400, "Couldn't insert User")


        return res.status(201).json(new ApiResponse(200, { user }, "User registered successfully"))

    } catch (error) {
        throw new ApiError(404, "Something went wrong", error.message)
    }
})

export const loginUser = asyncHandler(async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role)
            throw new ApiError(400, "All fields are required")

        const user = await pool.query("SELECT * FROM Users WHERE (email,role) = ?", [email, role])

        if (user[0].length === 0)
            throw new ApiError(400, "User not found")

        const isPasswordValid = await bcrypt.compare(password, user[0][0].password)

        if (!isPasswordValid)
            throw new ApiError(400, "Invalid password")

        const accesstoken = generateAccessToken(user[0][0].id)

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200)
            .cookie("accesstoken", accesstoken, options)
            .json(new ApiResponse(200, { accesstoken, user }, "User logged in successfully"))

    } catch (error) {
        throw new ApiError(404, "Something went wrong", error.message)
    }
})


export const logoutUser = asyncHandler(async (req, res, next) => {
    try {

        const options = {
            httpOnly: true,
            secure: true,
        }
        return res.status(200)
            .clearCookie("accesstoken", options)
            .json(new ApiResponse(200, "User logged out successfully"))

    } catch (error) {
        throw new ApiError(404, "Something went wrong", error.message)
    }
})
