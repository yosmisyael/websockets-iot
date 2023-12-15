const userService = require("../services/user-service");

const index = (req, res) => {
  res.status(200).render("pages/index", {
    layout: "layouts/main",
    title: "Soil Moisture Controller",
  });
};

const login = (req, res) => {
  res.status(200).render("pages/login", {
    layout: "layouts/main",
    title: "Soil Moisture Controller | Login",
  });
};

const postLogin = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.cookie("token", result.token);
    res.status(200).redirect("/dashboard");
  } catch (error) {
    res.render("pages/login", {
      layout: "layouts/main",
      title: "Soil Moisture Controller | Login",
      error: error.message,
    });
  }
};

const dashboard = (req, res) => {
  const token = req.cookies.token;

  res.status(200).render("pages/dashboard", {
    title: "Soil Moisture Controller | Dashboard",
    layout: "layouts/main",
    token: token,
  });
};

const postLogout = async (req, res) => {
  try {
    await userService.logout(req.body);
    res.clearCookie("token");
    res.status(200).redirect("/");
  } catch (error) {
    res.redirect("/dashboard");
  }
};

module.exports = { index, login, postLogin, dashboard, postLogout };
