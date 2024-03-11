import type { Book, BookDb } from "$lib/types";

export const serializeBooks = (books: BookDb[]): Book[] => {
  const booksMap = new Map();
  books.forEach(
    ({
      id,
      title,
      author,
      pages,
      rating,
      isFiction,
      publishDate,
      review,
      created,
      genreId,
      genreDescription,
    }) => {
      const bookId = id;
      if (!booksMap.has(bookId)) {
        booksMap.set(bookId, {
          id,
          title,
          author,
          pages,
          rating,
          isFiction: isFiction === 1,
          publishDate,
          review,
          created,
          genres: [],
        });
      }

      booksMap.get(bookId).genres.push({
        id: genreId,
        description: genreDescription,
      });
    }
  );

  return Array.from(booksMap.values());
};
