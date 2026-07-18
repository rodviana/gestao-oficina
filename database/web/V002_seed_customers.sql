-- Demo customers for the customer portal (password: 123456)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO customers (name, email, phone, password)
VALUES
    ('Roberto Silva',   'roberto@email.com', '11987654321', crypt('123456', gen_salt('bf', 10))),
    ('Ana Paula Costa', 'ana@email.com',     '11999887766', crypt('123456', gen_salt('bf', 10))),
    ('Marcos Oliveira', 'marcos@email.com',  '21988776655', crypt('123456', gen_salt('bf', 10)))
ON CONFLICT (email) DO NOTHING;
