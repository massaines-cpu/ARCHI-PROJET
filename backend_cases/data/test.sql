USE ARCHI;

INSERT INTO cases (id_infection, name, contamination_date, frequented_place) VALUES
(1, 'Jean Dupont', '2026-02-10 10:00:00', 'Centre commercial'),
(2, 'Marie Martin', '2026-02-12 14:30:00', 'Restaurant'),
(3, 'Pierre Durand', '2026-02-11 16:45:00', 'Immeuble de bureaux'),
(4, 'Sophie Bernard', '2026-02-13 09:15:00', 'Salle de sport'),
(5, 'Lucas Moreau', '2026-02-14 11:30:00', 'Parc');

CREATE INDEX idx_id_infection ON cases(id_infection);
CREATE INDEX idx_contamination_date ON cases(contamination_date);

SELECT * FROM cases;

