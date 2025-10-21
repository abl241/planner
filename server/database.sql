CREATE DATABASE planner;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,

  -- Core info
  name VARCHAR(200) NOT NULL,
  due_date TIMESTAMP,
  category VARCHAR(100),
  notes TEXT,
  link TEXT,

  -- Status
  is_completed BOOLEAN DEFAULT false,

  -- Repeat
  is_recurring BOOLEAN DEFAULT false,
  repeat_rule TEXT,  -- e.g. "DAILY", "WEEKLY", or JSON like {"freq":"weekly","interval":2}

  -- Reminders (multiple possible, so we'll use a separate table)
  -- see reminders table below

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,

  -- Core info
  name VARCHAR(200) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  category VARCHAR(100),
  notes TEXT,

  -- Repeat
  is_recurring BOOLEAN DEFAULT false,
  repeat_rule TEXT,  -- same idea as tasks

  -- Reminders (multiple possible, separate table)

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reminders table
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,

  -- Can link to either a task or an event
  task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,

  reminder_time TIMESTAMP NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

