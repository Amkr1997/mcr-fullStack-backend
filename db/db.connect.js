const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const initialization = async () => {
  try {
    const connectDb = await mongoose.connect(process.env.MONGO_URI);

    if (connectDb) console.log("Connected to Db");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initialization };
