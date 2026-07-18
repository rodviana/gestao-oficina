-- =============================================================================
-- Seed: usuários do sistema (staff)
-- Senhas: admin123 / attn123 / mech123 (BCrypt via pgcrypto)
-- =============================================================================

INSERT INTO users (email, password, name, role_id)
SELECT
    'admin@oficina.com',
    crypt('admin123', gen_salt('bf', 10)),
    'Admin Demo',
    r.id
FROM user_role r
WHERE r.code = 'ADMIN'
  AND NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'admin@oficina.com');

INSERT INTO users (email, password, name, role_id)
SELECT
    'atendente@oficina.com',
    crypt('attn123', gen_salt('bf', 10)),
    'Carla Atendente',
    r.id
FROM user_role r
WHERE r.code = 'ATTENDANT'
  AND NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'atendente@oficina.com');

INSERT INTO users (email, password, name, role_id)
SELECT
    'mecanico@oficina.com',
    crypt('mech123', gen_salt('bf', 10)),
    'João Mecânico',
    r.id
FROM user_role r
WHERE r.code = 'MECHANIC'
  AND NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'mecanico@oficina.com');
