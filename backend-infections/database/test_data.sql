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
    ('Rougeole', 10, CURRENT_DATE + 14, 8, 0.90),
    ('Varicelle', 14, CURRENT_DATE + 10, 7, 0.75),
    ('Oreillons', 16, CURRENT_DATE + 12, 6, 0.60),
    ('Hépatite A', 28, CURRENT_DATE + 20, 14, 0.40),
    ('Tuberculose', 21, CURRENT_DATE + 30, 20, 0.35),
    ('Paludisme', 12, CURRENT_DATE + 15, 10, 0.65),
    ('Dengue', 7, CURRENT_DATE + 8, 5, 0.70),
    ('Zika', 5, CURRENT_DATE + 6, 4, 0.55)
ON CONFLICT (name) DO NOTHING;
