const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://gazifahad34:a123456!!@cluster0.8pxf81a.mongodb.net/deliverfast?retryWrites=true&w=majority";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Access the 'foodItems' collection directly
    const itemData = mongoose.connection.db.collection("foodItems");
    const foodCategory = mongoose.connection.db.collection("foodCategory");
    // Use the find method to retrieve all documents in the collection
    const data = await itemData.find({}).toArray();
    const categoryData = await foodCategory.find({}).toArray();
    // console.log(data, categoryData);
    return { foodItems: data, foodCategory: categoryData };
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectToDatabase;
