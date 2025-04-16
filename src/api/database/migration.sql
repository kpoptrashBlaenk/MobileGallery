-- Session Table
CREATE TABLE
    session (cookies VARCHAR(255) NOT NULL);

-- Location Table
CREATE TABLE
    location (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

-- Person Table
CREATE TABLE
    person (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

-- Album Table
CREATE TABLE
    album (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

-- Media Table
CREATE TABLE
    media (
        id SERIAL PRIMARY KEY,
        path varchar(255) NOT NULL,
        type varchar(255) NOT NULL,
        season VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        location_id INT REFERENCES location (id) NOT NULL
    );

-- Media Person Relation
CREATE TABLE
    media_person_relation (
        media_id INT REFERENCES media (id) ON DELETE CASCADE,
        person_id INT REFERENCES person (id) ON DELETE CASCADE,
        PRIMARY KEY (media_id, person_id)
    );

-- Media Album Relation
CREATE TABLE
    media_album_relation (
        media_id INT REFERENCES media (id) ON DELETE CASCADE,
        album_id INT REFERENCES album (id) ON DELETE CASCADE,
        PRIMARY KEY (media_id, album_id)
    );