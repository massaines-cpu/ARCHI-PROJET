---- test_data.sql : données de test
--
--INSERT INTO infections (id, name, incubation_days, detection_date, contagion_days, contagion_level)
--VALUES
--    ('11111111-1111-1111-1111-111111111111', 'Covid-19', 5, 7, 10, 0.80),
--    ('22222222-2222-2222-2222-222222222222', 'Grippe', 2, 3, 5, 0.50),
--    ('33333333-3333-3333-3333-333333333333', 'Rougeole', 10, 14, 8, 0.90)
--ON CONFLICT (name) DO NOTHING;

INSERT INTO infections (name, incubation_days, detection_date, contagion_days, contagion_level)
VALUES
    ('Covid-19', 5, CURRENT_DATE + 7, 10, 0.80),
    ('Grippe', 2, CURRENT_DATE + 3, 5, 0.50),
    ('Rougeole', 10, CURRENT_DATE + 14, 8, 0.90)
ON CONFLICT (name) DO NOTHING;
