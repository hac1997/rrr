-- =============================================
-- data.sql - Dados iniciais ajustados para o schema.sql
-- Encoding: UTF-8 | Incluindo IDs explícitos e colunas NOT NULL
-- =============================================

-- 1. TAGS
INSERT INTO tags (id, code, label)
VALUES
    (1, 'AMBIENTAL', 'Meio Ambiente'),
    (2, 'SOCIAL', 'Ação Social'),
    (3, 'EDUCACIONAL', 'Educação e Treinamento'),
    (4, 'ESPORTES', 'Esportes'),
    (5, 'SAUDE', 'Saúde'),
    (6, 'CULTURA', 'Cultura')
ON CONFLICT (id) DO NOTHING;

-- 2. ORGANIZAÇÕES
INSERT INTO organizations (
    organization_id, cnpj, password_hash, name, description, email, phone, website, logo_image_url,
    city, state, zip_code, verified, active, created_at, deleted, updated_at
) VALUES
    (1, '11222333000101', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'Instituto Verde Vida', 'Organização focada em sustentabilidade e educação ambiental.', 'contato@verdevida.org', '(48)99888-1111', 'https://verdevida.org', 'logo_verdevida.png', 'Florianópolis', 'SC', '88010-000', true, true, NOW(), false, NULL),
    (2, '99888777000155', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'Projeto Mão Amiga', 'Organização voltada a ações sociais e voluntariado comunitário.', 'contato@maoamiga.org', '(48)98888-2222', 'https://maoamiga.org', 'logo_maoamiga.png', 'São José', 'SC', '88100-000', true, true, NOW(), false, NULL),
    (3, '12345678000123', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'Corrida pela Vida', 'Organização de eventos esportivos solidários.', 'contato@corridapelavida.org', '(11)99999-3333', 'https://corridapelavida.org', 'logo_corrida.png', 'São Paulo', 'SP', '01000-000', true, true, NOW(), false, NULL),
    (4, '23456789000134', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'ONG Mar Limpo', 'Foco em preservação marinha.', 'contato@marlimpo.org', '(21)99999-4444', 'https://marlimpo.org', 'logo_marlimpo.png', 'Rio de Janeiro', 'RJ', '20000-000', true, true, NOW(), false, NULL),
    (5, '34567890000145', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'Arte para Todos', 'Promoção de cultura comunitária.', 'contato@arteparatodos.org', '(31)99999-5555', 'https://arteparatodos.org', 'logo_arte.png', 'Belo Horizonte', 'MG', '30000-000', true, true, NOW(), false, NULL),
    (6, '45678900000156', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'Banco de Alimentos SP', 'Distribuição de alimentos.', 'contato@bancodealimentos.org', '(11)99999-6666', 'https://bancodealimentos.org', 'logo_banco.png', 'São Paulo', 'SP', '01000-000', true, true, NOW(), false, NULL),
    (7, '56789000000167', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'Instituto Educar', 'Educação para crianças.', 'contato@educar.org', '(11)99999-7777', 'https://educar.org', 'logo_educar.png', 'São Paulo', 'SP', '01000-000', true, true, NOW(), false, NULL),
    (8, '67890000000178', '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'Secretaria Municipal de Saúde', 'Campanhas de saúde pública.', 'contato@saude.gov.br', '(41)99999-8888', 'https://saude.gov.br', 'logo_saude.png', 'Curitiba', 'PR', '80000-000', true, true, NOW(), false, NULL)
ON CONFLICT (organization_id) DO NOTHING;

-- 3. USUÁRIOS (senhas: Herick@123 e Caua@123)
INSERT INTO users (
    user_id, cpf, firstname, lastname, email, phone, password_hash, user_type,
    birth_date, email_verified, active, created_at, deleted, updated_at
) VALUES
    (1, '12345678901', 'Herick', 'Carvalho', 'herick@email.com', '(48)99999-1111',
     '$2a$10$yGL9MKOAQTTUQydeVxz35OoTFvsnIhIHQoaNSrKpZa9odO.UnzYfa', 'VOLUNTEER',
     '1999-05-10', true, true, NOW(), false, NULL),
    (2, '98765432100', 'Cauã', 'Silva', 'caua@email.com', '(48)99999-2222',
     '$2a$10$YrWn7Ccdh1Ry6iPpDYGzyO8JNfNzYtJGRN/Bj9fgfWv8Kp14tk5vW', 'VOLUNTEER',
     '2000-08-15', true, true, NOW(), false, NULL)
ON CONFLICT (user_id) DO NOTHING;

-- 4. PERFIS
INSERT INTO profiles (
    profile_id, profile_url, headline, bio, profile_image_url, profession, description,
    city, state, zip_code, public_profile, points, level,
    completed_events, total_volunteer_hours, streak_days,
    user_id, created_at, deleted, updated_at
) VALUES
    (1, 'herickcarvalho', 'Estudante de Engenharia Ambiental', 'Apaixonado por projetos de sustentabilidade e voluntariado.', 'herick.png',
     'Estudante', 'Engenharia Ambiental na UFSC', 'Florianópolis', 'SC', '88010-000',
     true, 160, 3, 2, 7, 5,
     1, NOW(), false, NULL),
    (2, 'cauasilva', 'Voluntário e Educador Social', 'Trabalho com crianças em projetos de reforço escolar.', 'caua.png',
     'Educador Social', 'Voluntário em ONGs desde 2018', 'São José', 'SC', '88100-000',
     true, 80, 2, 1, 8, 3,
     2, NOW(), false, NULL)
ON CONFLICT (profile_id) DO NOTHING;

-- 5. EVENTOS
INSERT INTO events (
    event_id, title, description, start_date, end_date, cover_image_url,
    city, state, zip_code, volunteer_slots, filled_slots, points_reward,
    active, completed, organization_id, created_at, deleted, updated_at
) VALUES
    (1, 'Mutirão de Limpeza da Praia', 'Ação de coleta de resíduos nas praias locais.', '2025-05-01 08:00:00', '2025-05-01 12:00:00', 'praia.png',
     'Florianópolis', 'SC', '88062-000', 30, 20, 100, true, true,
     1, NOW(), false, NULL),
     
    (2, 'Oficina de Reciclagem Criativa', 'Atividade educativa sobre reciclagem para crianças.', '2025-04-15 14:00:00', '2025-04-15 17:00:00', 'reciclagem.png',
     'Florianópolis', 'SC', '88010-000', 15, 10, 60, true, true,
     1, NOW(), false, NULL),
     
    (3, 'Campanha do Agasalho', 'Arrecadação e distribuição de roupas de inverno.', '2025-06-10 09:00:00', '2025-06-10 18:00:00', 'agasalho.png',
     'São José', 'SC', '88100-000', 25, 18, 80, true, false,
     2, NOW(), false, NULL),
     
    (4, 'Reforço Escolar Voluntário', 'Aulas de reforço para alunos do ensino fundamental.', '2025-07-05 09:00:00', '2025-07-05 12:00:00', 'reforco.png',
     'São José', 'SC', '88101-000', 10, 8, 70, true, false,
     2, NOW(), false, NULL),
     
    (5, 'Feira da Cidadania', 'Ação social com serviços gratuitos para a comunidade.', '2025-03-20 08:00:00', '2025-03-20 16:00:00', 'feira.png',
     'Palhoça', 'SC', '88130-000', 40, 35, 90, true, true,
     2, NOW(), false, NULL),
     (6, 'Maratona Solidária 2024', 'Apoio logístico e distribuição de água para corredores', '2024-08-15 08:00:00', '2024-08-15 16:00:00', 'maratona.png', 'São Paulo', 'SP', '01000-000', 100, 89, 80, true, true, 3, NOW(), false, NULL),
    (7, 'Limpeza da Praia de Copacabana', 'Mutirão de limpeza e conscientização ambiental', '2024-07-22 09:00:00', '2024-07-22 15:00:00', 'praia_copacabana.png', 'Rio de Janeiro', 'RJ', '22000-000', 60, 45, 60, true, true, 4, NOW(), false, NULL),
    (8, 'Festival de Música Comunitário', 'Organização de palco e atendimento ao público', '2024-09-10 10:00:00', '2024-09-10 20:00:00', 'festival.png', 'Belo Horizonte', 'MG', '30000-000', 40, 25, 100, true, true, 5, NOW(), false, NULL),
    (9, 'Doação de Alimentos - Campanha Natal', 'Separação e empacotamento de cestas básicas', '2024-10-05 09:00:00', '2024-10-05 13:00:00', 'doacao.png', 'São Paulo', 'SP', '01000-000', 50, 34, 40, true, true, 6, NOW(), false, NULL),
    (10, 'Aula de Reforço Escolar', 'Tutoria em matemática para crianças do ensino fundamental', '2024-06-18 09:00:00', '2024-06-18 12:00:00', 'aula.png', 'São Paulo', 'SP', '01000-000', 20, 12, 30, true, true, 7, NOW(), false, NULL),
    (11, 'Campanha de Vacinação Comunitária', 'Apoio na organização de filas e documentação', '2024-05-30 08:00:00', '2024-05-30 15:00:00', 'vacinacao.png', 'Curitiba', 'PR', '80000-000', 30, 20, 70, true, true, 8, NOW(), false, NULL),
    (12, 'Plantio de Mudas - Reflorestamento', 'Plantio de 200 mudas nativas na Serra da Cantareira', '2024-04-12 08:00:00', '2024-04-12 13:00:00', 'plantio.png', 'São Paulo', 'SP', '01000-000', 25, 15, 50, true, true, 1, NOW(), false, NULL),
    (13, 'Workshop de Artesanato', 'Ensino de técnicas de artesanato para comunidade local', '2024-03-20 14:00:00', '2024-03-20 18:00:00', 'artesanato.png', 'São Paulo', 'SP', '01000-000', 15, 10, 40, true, true, 5, NOW(), false, NULL)
ON CONFLICT (event_id) DO NOTHING;

-- 6. EVENT_TAGS
INSERT INTO event_tags (event_id, tag_id)
VALUES
    (1, 1),  -- Mutirão de Limpeza da Praia - AMBIENTAL
    (2, 3),  -- Oficina de Reciclagem Criativa - EDUCACIONAL
    (3, 2),  -- Campanha do Agasalho - SOCIAL
    (4, 3),  -- Reforço Escolar Voluntário - EDUCACIONAL
    (5, 2),   -- Feira da Cidadania - SOCIAL
(6, 4),  -- Esportes
    (7, 1),  -- Meio Ambiente
    (8, 6),  -- Cultura
    (9, 2),  -- Social
    (10, 3), -- Educacional
    (11, 5), -- Saúde
    (12, 1), -- Meio Ambiente
    (13, 6)  -- Cultura
ON CONFLICT (event_id, tag_id) DO NOTHING;

-- 7. EVENT_VOLUNTEERS
INSERT INTO event_volunteers (event_id, user_id)
VALUES
    (1, 1),  -- Mutirão de Limpeza da Praia - Herick
    (1, 2),  -- Mutirão de Limpeza da Praia - Cauã
    (2, 1),  -- Oficina de Reciclagem Criativa - Herick
    (3, 2),  -- Campanha do Agasalho - Cauã
    (5, 1),   -- Feira da Cidadania - Herick
    (6, 1), (7, 1), (8, 1), (9, 2), (10, 2), (11, 2), (12, 1), (13, 2)
ON CONFLICT (event_id, user_id) DO NOTHING;

-- 8. BENEFITS
INSERT INTO benefits (benefit_id, title, description, event_id, created_at, deleted, updated_at)
VALUES
    (1, 'Certificado Digital', 'Certificado de participação emitido pela organização', 1, NOW(), false, NULL),
    (2, 'Lanche Incluso', 'Lanche e água mineral para todos os voluntários', 1, NOW(), false, NULL),
    (3, 'Material Didático', 'Kit com materiais educativos sobre reciclagem', 2, NOW(), false, NULL),
    (4, 'Vale Transporte', 'Auxílio transporte para os voluntários', 3, NOW(), false, NULL),
    (5, 'Certificado de 8h', 'Certificado de participação com carga horária', 4, NOW(), false, NULL)
ON CONFLICT (benefit_id) DO NOTHING;

INSERT INTO certificates (
    certificate_id, created_at, deleted, updated_at, date_certified, hours, event_id, organization_id, owner_id
) VALUES
    (1, NOW(), false, NULL, '2024-08-15', 8, 6, 3, 1),
    (2, NOW(), false, NULL, '2024-07-22', 6, 7, 4, 1),
    (3, NOW(), false, NULL, '2024-09-10', 10, 8, 5, 2),
    (4, NOW(), false, NULL, '2024-10-05', 4, 9, 6, 2),
    (5, NOW(), false, NULL, '2024-10-20', 5, 5, 2, 1)  -- Exemplo extra do mock
ON CONFLICT (certificate_id) DO NOTHING;
-- 9. NEWS
INSERT INTO news (news_id, title, body, image_url, publish_date, type, event_id, created_at, deleted, updated_at)
VALUES
    (1, 'Novo recorde de plantio de árvores!', 'A comunidade bateu o recorde de 500 árvores plantadas em um único dia!', 'images/plantio.png', NOW() - INTERVAL '10 days', 'ANNOUNCEMENT', NULL, NOW(), false, NULL),
    (2, 'Mutirão de Limpeza foi um sucesso!', 'Mais de 200kg de resíduos retirados da praia. Obrigado a todos os voluntários!', 'images/mutirao.png', NOW() - INTERVAL '3 days', 'EVENT', 1, NOW(), false, NULL),
    (3, 'Herick Carvalho alcançou nível 3!', 'Parabéns Herick por completar mais de 150 pontos e subir de nível!', 'images/nivel3.png', NOW() - INTERVAL '1 day', 'CONQUEST', NULL, NOW(), false, NULL),
    (4, 'Primeira Missão', 'Completou seu primeiro evento', 'primeira_missao.png', '2024-01-15', 'CONQUEST', NULL, NOW(), false, NULL),
    (5, 'Dedicação', '10 eventos completados', 'dedicacao.png', '2024-05-10', 'CONQUEST', NULL, NOW(), false, NULL),
    (6, 'Voluntário do Mês', 'Reconhecimento de destaque', 'voluntario_mes.png', '2024-07-01', 'CONQUEST', NULL, NOW(), false, NULL),
    (7, 'Impacto Social', '100 horas voluntariadas', 'impacto_social.png', '2024-09-22', 'CONQUEST', NULL, NOW(), false, NULL)
ON CONFLICT (news_id) DO NOTHING;

-- 10. COMMENTS
INSERT INTO comments (comment_id, content, user_id, news_id, created_at, deleted, updated_at)
VALUES
    (1, 'Adorei participar deste evento! Muito bem organizado.', 1, 2, NOW(), false, NULL),
    (2, 'Obrigado pelo feedback, Herick!', 2, 2, NOW(), false, NULL)
ON CONFLICT (comment_id) DO NOTHING;

-- 11. EVENT_LIKES
INSERT INTO event_likes (like_id, user_id, event_id, created_at, deleted, updated_at)
VALUES
    (1, 1, 1, NOW(), false, NULL),  -- Herick - Mutirão
    (2, 1, 2, NOW(), false, NULL),  -- Herick - Oficina
    (3, 1, 5, NOW(), false, NULL),  -- Herick - Feira
    (4, 2, 1, NOW(), false, NULL),  -- Cauã - Mutirão
    (5, 2, 3, NOW(), false, NULL)   -- Cauã - Campanha
ON CONFLICT (like_id) DO NOTHING;

-- 12. NOTIFICATIONS
INSERT INTO notifications (notification_id, message, type, sent_at, read, user_id)
VALUES
    (1, 'Você foi inscrito no evento Mutirão de Limpeza da Praia!', 'EVENT_CONFIRMATION', NOW() - INTERVAL '5 days', true, 1),
    (2, 'Nova conquista: Nível 3 alcançado!', 'ACHIEVEMENT', NOW() - INTERVAL '1 day', false, 1),
    (3, 'Novo evento disponível na sua área', 'EVENT_AVAILABLE', NOW() - INTERVAL '30 minutes', false, 1),
    (4, 'Lembrete: Evento amanhã às 9h', 'EVENT_REMINDER', NOW() - INTERVAL '2 hours', false, 1),
    (5, 'Você recebeu um novo certificado', 'CERTIFICATE_AVAILABLE', NOW() - INTERVAL '5 hours', false, 2)
ON CONFLICT (notification_id) DO NOTHING;

-- =============================================
-- Reset sequences to start after seed data
-- =============================================
SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('organizations_organization_id_seq', (SELECT MAX(organization_id) FROM organizations));
SELECT setval('profiles_profile_id_seq', (SELECT MAX(profile_id) FROM profiles));
SELECT setval('events_event_id_seq', (SELECT MAX(event_id) FROM events));
SELECT setval('benefits_benefit_id_seq', (SELECT MAX(benefit_id) FROM benefits));
SELECT setval('certificates_certificate_id_seq', (SELECT MAX(certificate_id) FROM certificates));
SELECT setval('news_news_id_seq', (SELECT MAX(news_id) FROM news));
SELECT setval('comments_comment_id_seq', (SELECT MAX(comment_id) FROM comments));
SELECT setval('event_likes_like_id_seq', (SELECT MAX(like_id) FROM event_likes));
SELECT setval('notifications_notification_id_seq', (SELECT MAX(notification_id) FROM notifications));