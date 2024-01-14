const express = require("express");
const router = express.Router();
const Orders = require("../models/Orders");

router.post("/OrderData", async (req, res) => {
  let data = req.body.order_data;
  await data.splice(0, 0, { Order_date: req.body.order_date });
  let eId = await Orders.findOne({ email: req.body.email });
  if (eId === null) {
    try {
      await Orders.create({
        email: req.body.email,
        order_data: [data],
      }).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.send("Server error", error.message);
    }
  } else {
    try {
      await Orders.findOneAndUpdate(
        { email: req.body.email },
        {
          $push: { order_data: [data] },
        }
      ).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).send(error.message);
    }
  }
});

router.post("/MyOrderData", async (req, res) => {
  try {
    let mydata = await Orders.findOne({ email: req.body.email });
    res.json({ orderData: mydata });
  } catch (error) {
    res.send("server error", error.message);
  }
});

module.exports = router;
