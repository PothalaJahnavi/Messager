const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const { notFound, errorHandler } = require("./middleWare/errorMiddleware");
dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(MONGO_URL, { useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeOut: 50000, //the amount of time that the socket waits to establish a connection if the connection is inactive
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    //creating a room with user id in the setup socket
    console.log("socket userid", userData.id);
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("Join Chat", (roomId) => {
    socket.join(roomId);
    console.log("User joined room", roomId);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
