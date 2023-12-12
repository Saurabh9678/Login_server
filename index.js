const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { firstLog, saveLog } = require("./controllers/log.js");
const connectDataBase = require("./database/database.js");

//Handling Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught exception`);
  process.exit(1);
});

//Config
dotenv.config({ path: "database/config.env" });

//Connecting to database
connectDataBase();

app.get("/", (req, res) => {
  res.status(200).json({ Message: "Hello bro! I am working " });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User connected id: ${socket.id}`);
  socket.on("join_room", () => {
    socket.join("honeypot");
    console.log(
      `User with id: ${socket.id} and ip Address: ${socket.handshake.address}`
    );
  });
  socket.on("track_action", async (data) => {
    socket.to("honeypot").emit("track_action", data);
    if (data.first === 0) {
      await firstLog(
        socket.handshake.address,
        data.email,
        data.password,
        data.action
      );
    } else {
      await saveLog(socket.handshake.address, data.action);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running in http://localhost:${process.env.PORT}`);
});

//Unhandled Promise rejections
//This may occur if we miss handle the connection strings

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise rejections`);

  server.close(() => {
    process.exit(1);
  });
});
