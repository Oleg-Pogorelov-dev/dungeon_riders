const jwt = require("jsonwebtoken");
const keyJwt = require("../config/config").secretKey;

const createToken = (user, expiresIn) => {
  try {
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      keyJwt,
      { expiresIn }
    );
    return token;
  } catch (e) {
    console.log("CREATE_TOKEN_ERROR:", e);
  }
};

module.exports = {
  createToken,
};
