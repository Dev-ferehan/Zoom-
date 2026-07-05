const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
  cors: {
    origin: "*",
  },
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    // console.log('bini joined room:', roomId);

    socket.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);

    });
    socket.on("end-meeting", ()=>{
   
      io.to(roomId).emit("leave-meeting",userId)
   
            })

    socket.on("message", (message) => {
      // console.log(message)
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on port 4000");
});
