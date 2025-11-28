import { io } from "socket.io-client";

//PASTE THE TOKEN GENERATED FROM /auth/login ENDPOINT HERE
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NDI1NTU5NiwiZXhwIjoxNzY0ODYwMzk2fQ.s3d1aIv428oaquFAkIWyz1VSB9sKQvZhg78bjCz4qjk";

const socket = io("http://localhost:3000", {
  auth: {
    token
  }
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});
