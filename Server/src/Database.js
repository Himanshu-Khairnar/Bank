import mysql from "mysql2";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

const connectDatabase = async () => {
    try {
        const [rows] = await pool.query("SELECT 1"); // Simple query to check connection
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        throw err; // Propagate the error
    }
};

export { pool, connectDatabase };
// export const accounts = async () => {
//     const [rows] = await pool.query("SELECT * FROM Accounts");
//     console.log(rows);
//     return rows[0]
// }

// export const users = async () => {
//     const query = await pool.query("SELECT * FROM Users")
//     console.log(query[0]);
//     return query[0]
// }



