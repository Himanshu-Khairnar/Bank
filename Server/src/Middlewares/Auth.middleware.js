import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pool } from "../Database.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new ApiError(401, "Unauthorized: Token not found");

        const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);

        const [user] = await pool.query("SELECT * FROM Users WHERE id = ?", [decodedToken.id]);
        if (!user || user.length === 0) throw new ApiError(401, "Invalid Access Token: User not found");
        if (user[0].Role === 'admin')
            throw new ApiError(403, "Forbidden: Your a admin");


        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        throw new ApiError(401, error.message || "Invalid Access Token");
    }
});
