-- Default admin user (password: admin123, BCrypt strength 10)
INSERT INTO users (email, password, name, role)
VALUES (
    'admin@oficina.com',
    '$2b$10$RJRjLHhMLFc7/Dm6n.45a.6GGFd3bE94GIgUwkzVx3PpcDzZiUvwC',
    'Administrator',
    'ADMIN'
)
ON CONFLICT (email) DO NOTHING;
