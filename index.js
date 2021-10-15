const express = require("express");
const app = express();
const home = require("./routes/home");
const genres = require("./routes/genres")
const customers = require("./routes/customers.js");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const env = require("dotenv");

env.config();
app.use(express.json());

const mongoAtlasUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.16mvn.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => console.log("ERORR IN CONNECTING DATABASE", err.message));

    
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));