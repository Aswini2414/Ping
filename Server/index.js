const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data.js");
const connect = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const notFound = require("./middleware/errorMiddleware.js");
const cors = require("cors");
const app = express();
const path = require("path");

dotenv.config({path:'./.env'});

connect();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// app.get("/", (req, res) => {
//   console.log("hi");
//   res.send("API is running....");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
//app.use(notFound);

//-------------------deployment---------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//------------------deployment----------------------

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(__dirname1);
  console.log(`Server is running on the port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e7,
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`${socket.id} joined ${userData._id}`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
