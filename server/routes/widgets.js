cosnt express = require('express');
const pool = require('../db');

const router = express.Router();

// ************************************************* Get a widget by ID **********************************************************

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const widget = await pool.query("SELECT * FROM widgets WHERE id = $1",
            [ req.params.id ]
        );
        res.json(widget.rows);
    } catch (err) {
        console.error("Error fetching widget: ", err.message);
        res.status(500).json({ message: "Server error fetching widget" });
    }
});

// ************************************************* Get all widgets **********************************************************

router.get('/', async (req, res) => {
    try {
        const widgets = await pool.query("SELECT * FROM widgets");
        res.json(widgets.rows);
    } catch (err) {
        console.error("Error fetching widgets: ", err.message);
        res.status(500).json({ message: "Server error fetching widgets" });
    }
});


// ---------------------================================================= USER WIDGETS =================================================---------------------

// ************************************************* Create a new user widget **********************************************************

// ************************************************ Get all user widgets **********************************************************

// ************************************************* Update a user widget **********************************************************

module.exports = router;