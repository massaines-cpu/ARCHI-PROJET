USE ARCHI;
INSERT INTO cases (id_infection, name, contamination_date, frequented_places) VALUES
(1, 'Jean Dupont',   '2024-01-15 08:30:00', ST_GeomFromText('MULTIPOINT((2.2945 48.8584),(2.3733 48.8448),(2.3376 48.8606))', 4326)),
(2, 'Marie Martin',  '2024-01-18 14:00:00', ST_GeomFromText('MULTIPOINT((4.8322 45.7578),(4.8594 45.7606),(4.8200 45.7500))', 4326)),
(1, 'Paul Bernard',  '2024-01-20 09:15:00', ST_GeomFromText('MULTIPOINT((5.3698 43.2951),(5.3806 43.3028),(5.3750 43.2900))', 4326)),
(3, 'Sophie Leroy',  '2024-01-22 16:45:00', ST_GeomFromText('MULTIPOINT((2.3376 48.8606),(2.3567 48.8817),(2.3961 48.8483))', 4326)),
(2, 'Lucas Moreau',  '2024-01-25 11:00:00', ST_GeomFromText('MULTIPOINT((2.2945 48.8584),(4.8322 45.7578),(2.3733 48.8448))', 4326));

-- Index
CREATE INDEX idx_id_infection ON cases(id_infection);
CREATE INDEX idx_contamination_date ON cases(contamination_date);

SELECT * FROM cases;
