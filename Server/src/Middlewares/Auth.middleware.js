import {ApiError} from "../utils/ApiError.js";
import  {asyncHandler}  from "../utils/asyncHandler.js";
import {pool} from "../Database.js"
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token)
            throw new ApiError(401, "Unauthorized")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const [user] = await pool.query("SELECT * FROM Users WHERE id = ?", [decodedToken.id])
        if (!user)
            throw new ApiError(401, "Invalid Access Token")

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})