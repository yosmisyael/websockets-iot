const ResponseError = require("../errors/response-error");

const errorMiddleware = async (error, req, res, next) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof ResponseError) {
    res
      .status(error.status)
      .json({
        error: error.message,
      })
      .end();
  } else {
    res
      .status(error.status)
      .json({
        error: error.message,
      })
      .end();
  }
};

module.exports = errorMiddleware;
