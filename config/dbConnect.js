const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const dbConnect = () => {
  mongoose.connect(DB);

  mongoose.connection.on("connected", () => {
    console.log("DB connection successful!");
  });
  mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to database");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected");
  });
};

module.exports = dbConnect;
