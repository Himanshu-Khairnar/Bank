import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pool } from "../Database.js";

export const AllAccounts = asyncHandler(async (req, res, next) => {
    try {
        const query = `
            SELECT 
                U.username,
                U.email,
                A.balance,
                SUM(CASE WHEN A.transaction_type = 'deposit' THEN A.amount ELSE 0 END) AS total_deposit,
                SUM(CASE WHEN A.transaction_type = 'withdrawal' THEN A.amount ELSE 0 END) AS total_withdrawal
            FROM 
                Users U
            LEFT JOIN 
                Accounts A
            ON 
                U.id = A.user_id
            GROUP BY 
                U.id, U.username, U.email, A.balance
                 ORDER BY
            U.created_at ASC;
        `;

        const [accounts] = await pool.query(query); // Execute the SQL query

        if (accounts.length === 0)
            throw new ApiError(400, "No accounts found");

        return res.status(200).json(new ApiResponse(200, { accounts }, "Accounts fetched successfully"));
    } catch (error) {
        throw new ApiError(404, "Something went wrong", error.message);
    }
});


export const SingleAccount = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.params; // Fetch userId from the request parameters

        if (!userId)
            throw new ApiError(400, "User ID is required");

        const query = `
            SELECT 
                U.username,
                U.email,
                U.created_at AS account_creation_time,
                A.transaction_type,
                A.amount,
                A.created_at AS transaction_time,
                SUM(CASE WHEN A.transaction_type = 'deposit' THEN A.amount ELSE 0 END) AS total_deposit,
                SUM(CASE WHEN A.transaction_type = 'withdrawal' THEN A.amount ELSE 0 END) AS total_withdrawal,
                MAX(A.balance) AS total_balance
            FROM 
                Users U
            LEFT JOIN 
                Accounts A
            ON 
                U.id = A.user_id
            WHERE 
                U.id = ?
            GROUP BY 
                A.id, U.id, A.transaction_type
            ORDER BY 
                A.created_at ASC;
        `;

        const [userAccount] = await pool.query(query, [userId]); // Execute query with userId

        if (userAccount.length === 0)
            throw new ApiError(404, "User not found or no transactions available");

        return res.status(200).json(new ApiResponse(200, { userAccount }, "User account details fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong", error.message);
    }
});