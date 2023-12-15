const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const controller = require("../controllers/main-controller");

const authRouter = new express.Router();
authRouter.use(authMiddleware);

authRouter.get("/dashboard", controller.dashboard);
authRouter.post("/logout", controller.postLogout);

module.exports = authRouter;
