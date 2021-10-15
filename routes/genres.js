const express = require("express");
const router = express.Router();
const Joi = require('joi');
const Genre = require("../models/genres");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(genre);
};

router.get("/", async (req, res) => {
    const genre = await Genre.find().sort('name');
    res.send(genre);
});

router.get("/:id", async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("ID NOT FOUND.");
    res.send(genre);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre); 
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: { name: req.body.name }
    }, { new: true });
    if (!genre) return res.status(404).send("ID NOT FOUND.");
    res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("ID NOT FOUND.");
    res.send(genre);
});

module.exports = router;