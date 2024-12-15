import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pool } from "../Database.js";
import jwt from "jsonwebtoken";

export const verifyJWTManager = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token:", token);

        if (!token) throw new ApiError(401, "Unauthorized: Token not found");

        const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
        console.log("Decoded Token:", decodedToken);

        const [user] = await pool.query("SELECT * FROM Users WHERE id = ?", [decodedToken.id]);
        console.log(user)
        if (!user || user.length === 0) throw new ApiError(401, "Invalid Access Token: User not found");

        console.log("user",user[0].Role)
        if (user[0].Role !== 'admin') 
            throw new ApiError(403, "Forbidden: Admin role required");
            


        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        throw new ApiError(401, error.message || "Invalid Access Token");
    }
});
