const express = require('express');
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

router.post('/user', async (req, res) => {
    try {
        const userId = req.user.id;
        const { widget_id, x, y, w, h, i, static, settings, section, is_visible, expanded_view } = req.body;

        const newUserWidget = await pool.query("INSERT INTO user_widgets (user_id, widget_id, x, y, w, h, i, static, settings, section, is_visible, expanded_view) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
            [ userId, widget_id, x, y, w, h, i, static, settings, section, is_visible, expanded_view ]
        );

        res.status(201).json(newUserWidget.rows[0]);
    } catch (err) {
        console.error("Error creating user widget: ", err.message);
        res.status(500).json({ message: "Server error creating user widget" });
    }
});

// ************************************************ Get all user widgets **********************************************************

router.get('/user', async (req, res) => {
    try {
        const userId = req.user.id;

        const userWidgets = await pool.query("SELECT * FROM user_widgets WHERE user_id = $1",
            [ userId ]
        );
        res.json(userWidgets.rows);
    } catch (err) {
        console.error("Error fetching user widgets: ", err.message);
        res.status(500).json({ message: "Server error fetching user widgets" });
    }
});

// ************************************************* Update a user widget **********************************************************

router.put('/user/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { x, y, w, h, i, static, settings, section, is_visible, expanded_view } = req.body;

        const updatedUserWidget = await pool.query("UPDATE user_widgets SET x = $1, y = $2, w = $3, h = $4, i = $5, static = $6, settings = $7, section = $8, is_visible = $9, expanded_view = $10 WHERE id = $11 AND user_id = $12 RETURNING *",
            [ x, y, w, h, i, static, settings, section, is_visible, expanded_view, id, userId ]
        );

        if(updatedUserWidget.rows.length === 0) {
            return res.status(404).json({ message: "User widget not found" });
        }

        res.json(updatedUserWidget.rows[0]);
    } catch (err) {
        console.error("Error updating user widget: ", err.message);
        res.status(500).json({ message: "Server error updating user widget" });
    }
});

module.exports = router;