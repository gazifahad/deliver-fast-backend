const express = require("express");
const connectToDatabase = require("./db");

connectToDatabase();
const app = express();
app.use(express.json());
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", require("./Routes/CreateUser"));

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
