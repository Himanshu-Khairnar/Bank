import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pool } from "../Database.js"
import jwt from "jsonwebtoken"
    
const generateAccessToken = async (user) => {
    try {

        return jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username
        }, process.env.ACCESSTOKEN_SECRET,
            {
                expiresIn: process.env.ACCESSTOKEN_EXPIRE
            })
    }
    catch (error) {
        throw new ApiError(404, "Something went wrong while generating access token", error.message)
    }

}

export const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role)  
            throw new ApiError(400, "All fields are required")


        const existingUser = await pool.query("SELECT * FROM Users WHERE email = ?", [email])

        if (existingUser[0].length > 0)
            throw new ApiError(400, "User already exists")

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)


        const user = await pool.query("INSERT INTO Users (username, email, password,role) VALUES (?, ?, ?,?)", [username, email, hashedPassword,role])

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

        const [users] = await pool.query("SELECT * FROM Users WHERE email = ? AND role = ?", [email, role]);

        const user = users[0]

        if (user.length === 0)
            throw new ApiError(400, "User not found")

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid)
            throw new ApiError(400, "Invalid password")

        const accessToken = await generateAccessToken(user)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            samesite: "None"
        }
      
        return res.status(200)
            .cookie("accesstoken", accessToken, options)
            .json(new ApiResponse(200, { accessToken, user }, "User logged in successfully"))

    } catch (error) {
        throw new ApiError(404, "Something went wrong while logging in",)
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


export const AccountInfo = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.params; // Fetch userId from the request parameters

        if (!userId)
            throw new ApiError(400, "User ID is required");

        const query = `
            SELECT 
                U.username,
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
})

export const withdrawalAmount = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (!userId || !amount)
            throw new ApiError(400, "User ID and amount are required");

        const [user] = await pool.query("SELECT * FROM Users WHERE id = ?", [userId]);

        if (user.length === 0)
            throw new ApiError(404, "User not found");

        const [accounts] = await pool.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END), 0) AS total_deposit,
                COALESCE(SUM(CASE WHEN transaction_type = 'withdrawal' THEN amount ELSE 0 END), 0) AS total_withdrawal
            FROM Accounts WHERE user_id = ?`,
            [userId]);

        const totalDeposit = accounts[0].total_deposit || 0;
        const totalWithdrawal = accounts[0].total_withdrawal || 0;

        // Calculate the total balance (deposit - withdrawal)
        const totalBalance = totalDeposit - totalWithdrawal;

        if (totalBalance < amount)
            return res.status(400).json(new ApiResponse(400, null, "Insufficient balance"));
        const newBalance = totalBalance - amount;
        const [transaction] = await pool.query(
            "INSERT INTO Accounts (user_id, transaction_type, amount, balance) VALUES (?, ?, ?, ?)",
            [userId, "withdrawal", amount, newBalance]
        );

        if (transaction.affectedRows === 0)
            throw new ApiError(500, "Transaction failed");

        return res.status(200).json(new ApiResponse(200, { transaction, newBalance }, "Withdrawal successful"));

    } catch (error) {
        throw new ApiError(500, "Something went wrong", error.message);
    }
})  

export const depoistAmount = asyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (!userId || !amount)
            throw new ApiError(400, "User ID and amount are required");

        const [user] = await pool.query("SELECT * FROM Users WHERE id = ?", [userId]);

        if (user.length === 0)
            throw new ApiError(404, "User not found");

        const [accounts] = await pool.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END), 0) AS total_deposit,
                COALESCE(SUM(CASE WHEN transaction_type = 'withdrawal' THEN amount ELSE 0 END), 0) AS total_withdrawal
            FROM Accounts WHERE user_id = ?`,
            [userId]);

        const totalDeposit = accounts[0].total_deposit || 0;
        const totalWithdrawal = accounts[0].total_withdrawal || 0;

        const totalBalance = totalDeposit - totalWithdrawal;

        const newBalance = totalBalance + parseFloat(amount);

        const [transaction] = await pool.query(
            "INSERT INTO Accounts (user_id, transaction_type, amount, balance) VALUES (?, ?, ?, ?)",
            [userId, "deposit", amount, newBalance]
        );

        if (transaction.affectedRows === 0)
            throw new ApiError(500, "Transaction failed");

        return res.status(200).json(new ApiResponse(200, { transaction, newBalance }, "Deposit successful"));

    } catch (error) {
        throw new ApiError(500, "Something went wrong", error.message);
    }
});
