const mongoose = require("mongoose");
const dataDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("db ga ulandi");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dataDB;
