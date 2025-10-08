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

// ************************************************* Get all reminders for a user **********************************************************

// ********************************************************** Update a reminder **********************************************************

// ********************************************************** Delete a reminder **********************************************************