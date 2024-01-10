const express = require("express");
const router = express.Router();
const connectToDatabase = require("../db.js");

router.post("/foodData", async (req, res) => {
  try {
    const { foodItems, foodCategory } = await connectToDatabase();

    // Do something with the data, e.g., log it

    res.send({ foodItems: foodItems, foodCategory: foodCategory });
  } catch (error) {
    console.error(error.message);
    res.send(error);
  }
});
module.exports = router;
