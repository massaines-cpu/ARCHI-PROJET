USE ARCHI;
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
    (10,'Maxime Dubois',   '2024-02-22 16:00:00', ST_GeomFromText('MULTIPOINT((2.3100 48.8550),(2.3200 48.8570),(2.3300 48.8580))', 4326));

-- Index
CREATE INDEX idx_id_infection ON cases(id_infection);
CREATE INDEX idx_contamination_date ON cases(contamination_date);

SELECT * FROM cases;
