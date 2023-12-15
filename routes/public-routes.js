const express = require("express");
const controller = require("../controllers/main-controller");
const unauthMiddleware = require("../middlewares/unauth-middleware");

const publicRouter = new express.Router();

publicRouter.get("/", controller.index);
publicRouter.get("/login", unauthMiddleware, controller.login);
publicRouter.post("/login", unauthMiddleware, controller.postLogin);

module.exports = publicRouter;
