INSERT INTO cases (id_infection, name, contamination_date, frequented_places) VALUES
(4, 'Alice Durand',    '2024-02-01 09:00:00', ST_GeomFromText('MULTIPOINT((2.3522 48.8566),(2.3600 48.8600),(2.3700 48.8500))', 4326)),
    (5, 'Marc Petit',      '2024-02-03 15:30:00', ST_GeomFromText('MULTIPOINT((4.8350 45.7600),(4.8400 45.7550),(4.8500 45.7580))', 4326)),
    (1, 'Clara Lemoine',   '2024-02-05 08:45:00', ST_GeomFromText('MULTIPOINT((2.3000 48.8600),(2.3100 48.8580),(2.3200 48.8550))', 4326)),
    (6, 'Julien Morel',    '2024-02-07 13:20:00', ST_GeomFromText('MULTIPOINT((5.3690 43.2950),(5.3700 43.3000),(5.3750 43.2980))', 4326)),
    (7, 'Emma Fabre',      '2024-02-10 10:15:00', ST_GeomFromText('MULTIPOINT((3.8790 43.6100),(3.8800 43.6150),(3.8850 43.6120))', 4326)),
    (2, 'Louis Martin',    '2024-02-12 17:00:00', ST_GeomFromText('MULTIPOINT((4.8300 45.7500),(4.8350 45.7550),(4.8400 45.7520))', 4326)),
    (3, 'Chloé Bernard',   '2024-02-15 09:30:00', ST_GeomFromText('MULTIPOINT((2.3400 48.8600),(2.3450 48.8620),(2.3500 48.8580))', 4326)),
    (8, 'Antoine Leroy',   '2024-02-18 11:45:00', ST_GeomFromText('MULTIPOINT((5.3750 43.2950),(5.3800 43.3000),(5.3850 43.2980))', 4326)),
    (9, 'Sophie Petit',    '2024-02-20 14:10:00', ST_GeomFromText('MULTIPOINT((2.2950 48.8570),(2.3000 48.8580),(2.3050 48.8600))', 4326)),
    (10,'Maxime Dubois',   '2024-02-22 16:00:00', ST_GeomFromText('MULTIPOINT((2.3100 48.8550),(2.3200 48.8570),(2.3300 48.8580))', 4326)),

    (5, 'Marine Dupont',   '2024-02-24 08:30:00', ST_GeomFromText('MULTIPOINT((-0.5792 44.8378),(-0.5850 44.8400),(-0.5720 44.8350))', 4326)),  -- Bordeaux
    (7, 'Baptiste Girard', '2024-02-25 11:00:00', ST_GeomFromText('MULTIPOINT((-1.5536 47.2184),(-1.5600 47.2200),(-1.5470 47.2160))', 4326)),  -- Nantes
    (6, 'Camille Fournier','2024-02-26 09:15:00', ST_GeomFromText('MULTIPOINT((3.0573 50.6292),(3.0630 50.6320),(3.0510 50.6260))', 4326)),      -- Lille
    (9, 'Théo Laurent',    '2024-02-27 14:45:00', ST_GeomFromText('MULTIPOINT((1.0993 49.4432),(1.1050 49.4460),(1.0930 49.4400))', 4326)),     -- Rouen
    (10,'Lucie Mercier',   '2024-02-28 16:30:00', ST_GeomFromText('MULTIPOINT((4.0317 49.2577),(4.0380 49.2600),(4.0250 49.2550))', 4326)),     -- Reims
    (8, 'Yasmine Benali',  '2024-03-01 10:00:00', ST_GeomFromText('MULTIPOINT((7.2620 43.7102),(7.2680 43.7130),(7.2560 43.7080))', 4326)),     -- Nice

    (3, 'Claire Arnaud',   '2024-03-02 07:30:00', ST_GeomFromText('MULTIPOINT((1.4442 43.6047),(1.4500 43.6080),(1.4380 43.6010))', 4326)),     -- CRITIQUE Toulouse
    (3, 'Thomas Wagner',   '2024-03-03 08:00:00', ST_GeomFromText('MULTIPOINT((7.7521 48.5734),(7.7580 48.5760),(7.7460 48.5710))', 4326)),     -- CRITIQUE Strasbourg
    (3, 'Isabelle Roux',   '2024-03-04 09:45:00', ST_GeomFromText('MULTIPOINT((5.7245 45.1885),(5.7300 45.1910),(5.7180 45.1860))', 4326)),     -- CRITIQUE Grenoble
    (3, 'Kevin Muller',    '2024-03-05 13:00:00', ST_GeomFromText('MULTIPOINT((6.1757 49.1193),(6.1820 49.1220),(6.1690 49.1160))', 4326));     -- CRITIQUE Metz


-- Index
CREATE INDEX idx_id_infection ON cases(id_infection);
CREATE INDEX idx_contamination_date ON cases(contamination_date);

SELECT * FROM cases;
