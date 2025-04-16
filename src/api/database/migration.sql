-- Session Table
CREATE TABLE
    session (cookies VARCHAR(255) NOT NULL);

-- Location Table
CREATE TABLE
    location (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

-- People Table
CREATE TABLE
    people (
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

-- Media People Relation
CREATE TABLE
    media_people_relation (
        media_id INT REFERENCES media (id) ON DELETE CASCADE,
        people_id INT REFERENCES people (id) ON DELETE CASCADE,
        PRIMARY KEY (media_id, people_id)
    );

-- Media Album Relation
CREATE TABLE
    media_album_relation (
        media_id INT REFERENCES media (id) ON DELETE CASCADE,
        album_id INT REFERENCES album (id) ON DELETE CASCADE,
        PRIMARY KEY (media_id, album_id)
    );