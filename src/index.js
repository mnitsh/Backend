import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
const mongoose_uri = process.env.MONGODB_URI;

connectDB(mongoose_uri)
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server started at PORT:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed");
  });

/*import express from "express";
const app = express();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    mongoose.connection
      .once("open", () => {
        console.log("DB connected..");
      })
      .on("error", (error) => {
        console.log("Err: ", error);
      });
    app.on("error", (error) => {
      console.log("Err: ", error);
      throw error;
    });
    app.listen(port, () => {
      console.log(`Server connected at PORT:${port}`);
    });
  } catch (error) {
    console.error("Err: ", error);
    throw err;
  }
})();*/
