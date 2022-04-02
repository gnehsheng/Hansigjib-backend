const express = require("express");
const router = express.Router();
const Menu = require('../models/Menu.js')

router.get("/seed", async (req, res) => {
    try {
        await Menu.deleteMany({})
        await Menu.create([
            {
                name: "Beef Soup",
                description: 'Hearty bowl of soup',
                price: '15',
                tags: ['beef', 'soup']
            }
        ]);
        res.send("Seed")
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
