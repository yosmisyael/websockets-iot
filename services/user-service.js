const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const validationSchema = require("../validations/user-validation");
const validate = require("../validations/validation");
const userRepository = require("../repository/user-repository");
const sessionRepository = require("../repository/session-repository");
const ResponseError = require("../errors/response-error");

const login = async (req) => {
  const validatedData = validate(validationSchema.userLoginValidation, req);
  const result = await userRepository.findUser(validatedData.username);

  if (!result) throw new ResponseError(404, "user is invalid");

  const isPasswordValid = await bcrypt.compare(
    validatedData.password,
    result.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(400, "username or password is wrong");
  }

  const token = uuid();

  const generateSession = await sessionRepository.store(result.username, token);
  if (!generateSession) {
    throw new ResponseError(500, "unhandled database error");
  }

  return {
    username: result.username,
    token,
  };
};

const logout = async (req) => {
  const validatedData = validate(validationSchema.userLogoutValidation, req);
  const result = await sessionRepository.destroy(validatedData.token);

  if (!result) {
    throw new ResponseError(500, "unhandled database error");
  }

  return true;
};

module.exports = { login, logout };
