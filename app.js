const express = require("express");
const errorMiddleware = require("./middleware/error");
const cors = require("cors")

const app = express();


app.use(cors())
app.use(express.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Request-Headers", 'https');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key");
    next();
  });

//Route Imports
const userRoutes = require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes")

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/log", logRoutes)

// MiddleWare for Error

app.use(errorMiddleware);

module.exports = app;
