const express = require("express");
const router = express.Router();
const Joi = require('joi');
const Movie = require("../models/movies");
const Genre = require("../models/genres");
const auth = require("../middleware/auth");

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    });
    return schema.validate(movie);
};

router.get("/", async (req, res) => {
    const movie = await Movie
        .find()
        .sort('name')
        .populate("genre", "name");
    res.send(movie);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie
        .findById(req.params.id)
        .populate("genre", "-__v");
    if (!movie) return res.status(404).send("ID NOT FOUND.");
    res.send(movie);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) res.status(400).send("Invalid Genre...");
    
    let movie = new Movie({
        title: req.body.title,
        genre: genre._id,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
    res.send(movie); 
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) res.status(400).send("Invalid Genre...");

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genre: genre._id,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });
    if (!movie) return res.status(404).send("ID NOT FOUND.");
    res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send("ID NOT FOUND.");
    res.send(movie);
});

module.exports = router;