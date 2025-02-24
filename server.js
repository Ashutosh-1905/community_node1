import { config as conf } from "dotenv";
conf();

import http from "http";
// import { Server } from "socket.io"; // Import Socket.IO server
import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/connectDB.js";

// Start the server on the specified port
const port = config.port || 4000;
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins for Socket.IO
//   },
// });

const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
