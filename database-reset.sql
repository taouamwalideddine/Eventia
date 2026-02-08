-- Drop and recreate Eventia database
-- Run this in pgAdmin Query Tool

-- Drop existing tables
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate tables with correct schema
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'PARTICIPANT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    time VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_event_id ON reservations(event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Insert sample data (optional)
INSERT INTO users (email, password, name, role) VALUES 
('admin@eventia.com', '$2b$10$example_hash', 'Admin User', 'ADMIN'),
('user@eventia.com', '$2b$10$example_hash', 'Test User', 'PARTICIPANT')
ON CONFLICT (email) DO NOTHING;

INSERT INTO events (title, description, event_date, location, capacity, price, status) VALUES 
('Tech Conference 2026', 'Annual technology conference', '2026-03-15 09:00:00', 'Convention Center', 500, 99.99, 'PUBLISHED'),
('Music Festival', 'Summer music festival', '2026-07-20 18:00:00', 'Central Park', 1000, 49.99, 'PUBLISHED')
ON CONFLICT DO NOTHING;
