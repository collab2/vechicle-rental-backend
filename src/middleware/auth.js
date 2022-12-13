const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;

      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      // eslint-disable-next-line prefer-destructuring
      token = token.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }

        // console.log(result);
        // result = {
        //     userId: 'ca2973ed-9414-4135-84ac-799b6602d7b2',
        //     role: 'user',
        //     iat: 1662696652,
        //     exp: 1662783052
        //   }
        request.decodeToken = result;
        return next();
      });
      return console.log();
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  isAdmin: async (request, response, next) => {
    try {
      // PROSES UNTUK PENGECEKAN ROLE
      const result = request.decodeToken;
      console.log(result);
      if (result.role === "user") {
        return wrapper.response(response, 403, "You're Not Admin", null);
      }
      return next();

      // console.log(request.decodeToken);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
      // console.log(error);
    }
  },
};
