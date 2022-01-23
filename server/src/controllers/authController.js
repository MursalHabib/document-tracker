const bcrypt = require("bcrypt");
const { Users, Documents } = require("../../db/models");
const jwtGen = require("../utils/jwtGenerator");

module.exports = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const checkUser = await Users.findOne({
        where: { email },
      });
      if (checkUser) {
        return res.status(403).json({ message: "USER ALREADY EXIST!" });
      }
      const bcryptPassword = await bcrypt.hash(
        password,
        bcrypt.genSaltSync(10)
      );

      const newUser = await Users.create({
        name,
        email,
        password: bcryptPassword,
      });

      const token = jwtGen(newUser.dataValues.id, newUser.dataValues.email);
      return res.json({ message: "USER REGISTERED...", token });
    } catch (error) {
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const checkUser = await Users.findOne({
        where: { email },
      });
      if (!checkUser) {
        return res.status(403).json({ message: "USER NOT FOUND :(" });
      }

      const validPassword = await bcrypt.compare(password, checkUser.password);
      if (!validPassword) {
        return res.status(403).json({ message: "INVALID PASSWORD..." });
      }
      const token = jwtGen(checkUser.dataValues.id, checkUser.dataValues.email);
      return res.json({ message: "LOGGED IN...", token });
    } catch (error) {
      res.status(500).json({ message: "SERVER ERROR :(" });
    }
  },
  verifyUser: (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      // console.log(err.message);
      res.status(500).send("Server error");
    }
  },
  getAllUsers: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await Users.findOne({
        where: { id },
        // include: [
        //   {
        //     model: Documents,
        //   },
        // ],
        // attributes: {
        //   exclude: ["password"],
        // },
      });
      return res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "SERVER ERROR :(" });
    }
  },
};
