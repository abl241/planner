import express from 'express';
import pool from '../db';

const router = express.Router();

// ********************************************************** Create a new task **********************************************************
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name,
            due_date,
            category,
            notes,
            link,
            is_completed,
            is_recurring,
            repeat_rule,
        } = req.body;

        if(!name) {
            return res.status(400).json("Task name is required");
        }

        const newTask = await pool.query("INSERT INTO tasks (user_id, name, due_date, category, notes, link, is_completed, is_recurring, repeat_rule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [ userId, name, due_date, category, notes, link, is_completed, is_recurring, repeat_rule ]
        );

        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error("Error creating task: ", err.message);
        res.status(500).json("Server error creating task");
    }
});

// ************************************************* Get a task by ID **********************************************************

router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const task = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
            [ id, userId ]
        );

        if(task.rows.length === 0) {
            return res.status(404).json("Task not found");
        }

        res.json(task.rows[0]);
    } catch (err) {
        console.error("Error fetching task: ", err.message);
        res.status(500).json("Server error fetching task");
    }
});

// ************************************************* Get all tasks for a user **********************************************************


// ************************************************* Delete a task **********************************************************


// ************************************************* Update a task **********************************************************