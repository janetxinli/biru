CREATE TYPE serving_type AS ENUM ('draft', 'bottle', 'can');
CREATE TYPE beer_type AS ENUM ('ale', 'lager', 'porter', 'stout', 'pilsner', 'pale ale', 'wheat', 'brown', 'blonde', 'IPA', 'sour');

DROP TABLE beers;

CREATE TABLE beers(
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  brewer VARCHAR(30) NOT NULL,
  rating FLOAT(2) NOT NULL,
  serving_type serving_type,
  beer_type beer_type,
  abv FLOAT(2),
  ibu INTEGER,
  date_added DATE,
  notes VARCHAR(255)
);

INSERT INTO beers (name, brewer, rating, serving_type, beer_type, abv, ibu, date_added, notes)
  VALUES ('Electric Unicorn', 'Phillips', 3.5, 'can', 'IPA', 6.5, 75, '2021-09-23', 'A light, citrusy and bitter IPA. Great for sipping on the beach or watching a game');

INSERT INTO beers (name, brewer, rating, serving_type, beer_type, abv, date_added)
  VALUES ('Lavender Sour', 'Moody Ales', 4., 'can', 'sour', 4.9, '2021-09-24');

INSERT INTO beers (name, brewer, rating, serving_type, beer_type, abv, date_added, notes)
  VALUES ('33 Acres of Ocean', '33 Acres', 4.5, 'bottle', 'pale ale', 5.3, '2021-09-20', 'This is a classic everyday beer made for glugging. Citrusy, hoppy and piney.');

INSERT INTO beers (name, brewer, rating, serving_type, beer_type, abv, date_added)
  VALUES ('No Brainer', 'Brassneck', 4.5, 'can', 'lager', 4.5, '2021-09-21');