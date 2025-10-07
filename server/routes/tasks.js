const express = require('express');
const pool = require('../db');

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
            return res.status(400).json({ message: "Task name is required" });
        }

        const newTask = await pool.query("INSERT INTO tasks (user_id, name, due_date, category, notes, link, is_completed, is_recurring, repeat_rule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [ userId, name, due_date, category, notes, link, is_completed, is_recurring, repeat_rule ]
        );

        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error("Error creating task: ", err.message);
        res.status(500).json({ message: "Server error creating task" });
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
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task.rows[0]);
    } catch (err) {
        console.error("Error fetching task: ", err.message);
        res.status(500).json({ message: "Server error fetching task" });
    }
});

// ************************************************* Get all tasks for a user **********************************************************

router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC",
            [ userId ]
        );

        res.json(tasks.rows);
    } catch (err) {
        console.error("Error fetching tasks: ", err.message);
        res.status(500).json({ message: "Server error fetching tasks" });
    }
});

// ************************************************* Delete a task **********************************************************

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const deleteTask = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
            [ id, userId]
        );

        if(deleteTask.rows.length === 0) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }

        res.json("Task deleted successfully");
    } catch (err) {
        console.error("Error deleting task: ", err.message);
        res.status(500).json({ message: "Server error deleting task" });
    }
});


// ************************************************* Update a task **********************************************************

router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
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

        const updateTask = await pool.query(`UPDATE tasks SET
            name = COALESCE($1, name),
            due_date = COALESCE($2, due_date),
            category = COALESCE($3, category),
            notes = COALESCE($4, notes),
            link = COALESCE($5, link),
            is_completed = COALESCE($6, is_completed),
            is_recurring = COALESCE($7, is_recurring),
            repeat_rule = COALESCE($8, repeat_rule),
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $9 AND user_id = $10 RETURNING *`,
            [ name, due_date, category, notes, link, is_completed, is_recurring, repeat_rule, id, userId ]
        );
        
        if(updateTask.rows.length === 0) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }

        res.json(updateTask.rows[0]);
    } catch (err) {
        console.error("Error updating task: ", err.message);
        res.status(500).json({ message: "Server error updating task" });
    }
});

module.exports = router;