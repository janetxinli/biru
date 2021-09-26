CREATE TYPE serving_type AS ENUM ('draft', 'bottle', 'can');

DROP TABLE beers;

CREATE TABLE beers(
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  brewer VARCHAR(30) NOT NULL,
  rating FLOAT(2) NOT NULL,
  serving_type serving_type,
  abv FLOAT(2),
  ibu INTEGER
);

INSERT INTO beers (name, brewer, rating, serving_type, abv, ibu) VALUES ('Electric Unicorn', 'Phillips', 4.5, 'can', 6.5, 75);
INSERT INTO beers (name, brewer, rating, serving_type, abv) VALUES ('Lavender Sour', 'Moody Ales', 4.25, 'can', 4.9);