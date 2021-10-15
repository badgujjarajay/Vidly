const express = require("express");
const router = express.Router();
const Joi = require('joi');
const Movie = require("../models/movies");
const Customer = require("../models/customers");
const Rental = require("../models/rentals");
const auth = require("../middleware/auth");

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
        rentalFee: Joi.number().min(0),
        dateOut: Joi.date(),
        dateReturned: Joi.date()
    });
    return schema.validate(rental);
};

router.get("/", async (req, res) => {
    const rental = await Rental
        .find()
        .sort('name')
        .populate("customer", "name")
        .populate("movie", "title");
    res.send(rental);
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send("ID NOT FOUND.");
    res.send(rental);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) res.status(400).send("Invalid Customer...");
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) res.status(400).send("Invalid Movie...");
    if (movie.numberInStock === 0) return res.status(400).send("Movie not available...");

    let rental = new Rental({
        customer: customer._id,
        movie: movie._id,
        rentalFee: movie.dailyRentalRate
    });
    rental = await rental.save();
    movie.numberInStock--;
    await movie.save();

    res.send(rental); 
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) res.status(400).send("Invalid Customer...");
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) res.status(400).send("Invalid Movie...");
    
    const rental = await Rental.findByIdAndUpdate(req.params.id, {
        $set: {
            customer: customer._id,
            movie: movie._id,
            rentalFee: movie.dailyRentalRate
        }
    }, { new: true });
    if (!rental) return res.status(404).send("ID NOT FOUND.");
    res.send(rental);
});

router.delete("/:id", auth, async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send("ID NOT FOUND.");
    res.send(rental);
});

module.exports = router;