/**
 * server.js
 *
 * Kyu exist karta hai?
 * - Application ka ENTRY POINT hai - yahan se sab start hota hai
 * - Environment variables load karta hai, DB connect karta hai, server listen karta hai
 * - npm start / npm run dev isi file ko chalata hai
 */

// Sabse pehle dotenv - .env file se variables process.env me load karo
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Port .env se lo, nahi mila to default 5000
const PORT = process.env.PORT || 5000;

// Server start karne se pehle database se connect karo
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`HireSense AI server port ${PORT} par chal raha hai`);
  });
};

startServer();
