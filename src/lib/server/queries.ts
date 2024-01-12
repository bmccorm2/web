export const GET_CARS_OWNED = `
  SELECT id, displayName
  FROM cars t
  where t.isOwned=1;
`;

export const GET_SUMMARY = `
SELECT 
  sum(t.miles) as total_miles
  ,sum(t.price) as total_price
  ,sum(t.miles) / sum(t.gallons) as total_miles_per_gallon
  ,sum(t.price) / sum(t.gallons) as total_price_per_gallon
FROM consumption t
where t.carId=:carId;
`;

export const GET_CONSUMPTION = `
SELECT
  t.id
  ,t.created
  ,t.miles / t.gallons as miles_per_gallon
  ,t.price / t.gallons as price_per_gallon
  ,t.notes
FROM consumption t
where t.carId=:carId
ORDER BY t.id DESC
LIMIT 50;
`;

export const INSERT_CONSUMPTION = `
INSERT INTO consumption (carId, price, gallons, miles, notes) VALUES (
  :carId
  ,:price
  ,:gallons
  ,:miles
  ,:notes
)
`;

export const GET_BOOKS = `
  SELECT b.id, b.title, b.author, b.pages, b.rating, b.isFiction, b.publishDate, b.review, b.created, g.description as genreDescription, bg.genreId
  FROM books b
  INNER JOIN books_genres_association bg on bg.bookId=b.id
  INNER JOIN genres g on g.id=bg.genreId  
  ORDER BY b.id DESC
`;

export const GET_BOOK = `
  SELECT b.id, b.title, b.author, b.pages, b.rating, b.isFiction, b.publishDate, b.review, b.created, g.description as genreDescription, bg.genreId
  FROM books b
  INNER JOIN books_genres_association bg on bg.bookId=b.id
  INNER JOIN genres g on g.id=bg.genreId  
  WHERE b.id=:id
`;

export const DELETE_BOOK = `
  DELETE FROM books
  where id=:id;
`;

export const GET_GENRES = `
  SELECT id, description
  FROM genres;
`;

export const UPDATE_BOOK = `
  UPDATE books
  SET title=:title  
    ,author=:author
    ,pages=:pages
    ,rating=:rating
    ,isFiction=:isFiction
    ,publishDate=:publishDate
    ,review=:review
  WHERE id=:id;
`;

export const DELETE_BGA = `
  DELETE from books_genres_association
  WHERE bookId=:id;
`;

export const INSERT_BGA = `  
  INSERT INTO books_genres_association(bookId, genreId) VALUES (
    :id
    ,:genreId
  )
`;

export const INSERT_BOOK = `
  INSERT INTO books (title, author, pages, rating, isFiction, publishDate, review)
  VALUES (:title, :author, :pages, :rating, :isFiction, :publishDate, :review);
`;

export const INSERT_GENRE = `
  INSERT INTO genres (description)
  VALUES (:description);
`;

export const DELETE_GENRE = `
  DELETE FROM genres
  where id=:id
`;
