const home = require("./home");
const genres = require("./genres")
const customers = require("./customers.js");
const movies = require("./movies");
const rentals = require("./rentals");
const users = require("./users");
const auth = require("./auth");
const router = require("express").Router();

router.use("/home", home);
router.use("/genres", genres);
router.use("/customers", customers);
router.use("/movies", movies);
router.use("/rentals", rentals);
router.use("/users", users);
router.use("/auth", auth);

module.exports = router;