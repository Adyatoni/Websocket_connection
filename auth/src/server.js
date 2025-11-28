import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { sequelize, User, Socket } from "./models/index.js";
import authRouter from "./routes/auth.js";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET","POST"] }
});


io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    (socket.handshake.headers.authorization || "").split(" ")[1];

  if (!token) return next(new Error("Authentication error"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.userId;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  const userId = socket.userId;
  const sid = socket.id;
  console.log(`User ${userId} connected with socket id ${sid}`);


  await Socket.create({ userId, socketId: sid });

  socket.on("disconnect", async () => {
    console.log(`User ${userId} disconnected (${sid})`);
    await Socket.destroy({ where: { socketId: sid } });
  });

 
  socket.on("send-message", (payload) => {
    console.log("Message from", userId, ":", payload);
  });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    
    await sequelize.sync();
    console.log("Models synchronized (tables created/checked).");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Unable to start server:", err);
  }
})();
