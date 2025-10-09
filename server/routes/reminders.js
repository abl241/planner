const express = require('express');
const pool = require('../db');

const router = express.Router();

// ********************************************************** Create a new reminder **********************************************************

router.post('/', async (req, res) => {
    try {
        const userID = req.user.id;
        const {
            task_id,
            event_id,
            reminder_time
        } = req.body;

        if(!reminder_time) {
            return res.status(400).json({ message: "Reminder time is required" });
        }

        if(task_id && event_id) {
            return res.status(400).json({ message: "Provide only task_id or event_id, not both" });
        }

        const newReminder = await pool.query("INSERT INTO reminders (user_id, task_id, event_id, reminder_time) VALUES ($1, $2, $3, $4) RETURNING *",
            [ userID, task_id || null, event_id || null, reminder_time ]
        );

        res.status(201).json(newReminder.rows[0]);
    } catch (err) {
        console.error("Error creating reminder: ", err.message);
        res.status(500).json({ message: "Server error creating reminder" });
    }
});

// ************************************************* Get a reminder by ID **********************************************************

router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const reminder = await pool.query("SELECT * FROM reminders WHERE id = $1 AND user_id = $2",
            [ id, userId ]
        );

        if(reminder.rows.length === 0) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        res.json(reminder.rows[0]);
    } catch (err) {
        console.error("Error fetching reminder: ", err.message);
        res.status(500).json({ message: "Server error fetching reminder" });
    }

});

// ************************************************* Get all reminders for a user **********************************************************

// ********************************************************** Update a reminder **********************************************************

// ********************************************************** Delete a reminder **********************************************************