const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bookRouter = require("./routes/bookRoutes");
const errorController = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);

app.use(errorController);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB up");
});

app.listen(3002, () => console.log("server started"));
