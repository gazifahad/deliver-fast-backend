const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwtSecret = "BzkwYb9DSQxY8vbOBPFdYriAMCsys5";
// create new user
router.post(
  "/createuser",
  body("email").isEmail(),
  body("email").custom(async (value) => {
    const user = await User.findOne({ email: value });
    if (user) {
      throw new Error("E-mail already in use");
    }
  }),
  body("password", "password less than 5 characters").isLength({ min: 5 }),
  body("name", "name less than 5 characters").isLength({ min: 4 }),
  body("name").custom(async (value) => {
    const user = await User.findOne({ name: value });
    if (user) {
      throw new Error("user-name already in use");
    }
  }),
  async (req, res) => {
    const result = validationResult(req);
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);
    if (result.isEmpty()) {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.send({ success: true });
      return;
    }

    res
      .status(400)
      .send({ errors: result.array() }, console.log(result.array()), {
        success: false,
      });
  }
);

// login
router.post("/loginuser", async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  console.log(userPassword);

  let userData = await User.findOne({ email: userEmail });
  console.log(userData);
  if (!userData) {
    return res
      .status(400)
      .json({ error: "try login with correct credentials" });
  }
  const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
  if (!pwdCompare) {
    return res.status(400).json({ error: "try login with correct password" });
  }
  const data = {
    user: {
      id: userData._id,
      email: userEmail,
    },
  };
  const authToken = jwt.sign(data, jwtSecret);
  res.status(200).json({ success: true, authToken: authToken });
});
module.exports = router;
