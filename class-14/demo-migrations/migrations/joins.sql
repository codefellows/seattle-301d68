CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

INSERT INTO authors(name) SELECT DISTINCT author FROM books;

ALTER TABLE books ADD COLUMN author_id INT;

UPDATE books SET author_id=author.id FROM (SELECT * FROM authors) AS author WHERE books.author = author.name;

ALTER TABLE books DROP COLUMN author;

ALTER TABLE books ADD CONSTRAINT fk_authors FOREIGN KEY (author_id) REFERENCES author(id);