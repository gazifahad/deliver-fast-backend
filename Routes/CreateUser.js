const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
// get users for validation

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
    if (result.isEmpty()) {
      await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        location: req.body.location,
      });
      res.send({ success: true });
      return;
    }

    res.send({ errors: result.array() }, console.log(result.array()), {
      success: false,
    });
  }
);
module.exports = router;
