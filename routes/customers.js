const express = require("express");
const router = express.Router();
const Joi = require('joi');
const Customer = require("../models/customers");
const auth = require("../middleware/auth");

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(20).required()
    });
    return schema.validate(customer);
};

router.get("/", async (req, res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("ID NOT FOUND.");
    res.send(customer);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = new Customer(req.body);
    customer = await customer.save();
    res.send(customer); 
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });
    if (!customer) return res.status(404).send("ID NOT FOUND.");
    res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("ID NOT FOUND.");
    res.send(customer);
});

module.exports = router;