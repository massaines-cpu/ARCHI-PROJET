-- init.sql : structure de la base (tables, contraintes)

CREATE TABLE IF NOT EXISTS infections (
	id VARCHAR PRIMARY KEY,
	name VARCHAR(120) UNIQUE NOT NULL, 
	incubation_days INTEGER NOT NULL CHECK (incubation_days BETWEEN 0 AND 365),
	detection_days INTEGER NOT NULL CHECK (detection_days BETWEEN 0 AND 365),
	contagion_days INTEGER NOT NULL CHECK (contagion_days BETWEEN 0 AND 365),
	contagion_level FLOAT NOT NULL CHECK (contagion_level BETWEEN 0 AND 1)
);

-- index utile pour les recherches (optionnel)
CREATE INDEX IF NOT EXISTS idx_infections_name ON infections (name);
