const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, user_email) {
  const payload = {
    user: {
      id: user_id,
      email: user_email,
    },
  };

  return jwt.sign(payload, process.env.SECRET, { expiresIn: "24h" });
}

module.exports = jwtGenerator;
