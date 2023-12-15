const express = require("express");
const { createServer } = require("node:http");
const path = require("path");
const layouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const publicRouter = require("../routes/public-routes");
const authRouter = require("../routes/auth-routes");

const app = express();
const httpServer = createServer(app);

app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());
app.use(layouts);
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "../public")));
app.use(publicRouter);
app.use(authRouter);

module.exports = { httpServer };
