require("express-async-errors");
const winston = require("winston");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const env = require("dotenv");
const error = require("./middleware/error");
const routes = require("./routes/index");
env.config();
app.use(express.json());

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

process.on("uncaughtException", (ex) => {
    logger.error(ex.message, ex);
    process.exit(1);
});

process.on("unhandledRejection", (ex) => {
    logger.error(ex.message, ex);
    process.exit(1);
});

// throw new Error("Something failed dring startup.");
// const p = Promise.reject(new Error("Something failed dring startup."));
// p.then(() => console.log("DONE"));

const mongoAtlasUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.16mvn.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => console.log("ERORR IN CONNECTING DATABASE", err.message));

    
app.use("/api", routes);

//error handling
app.use(error(logger));

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));