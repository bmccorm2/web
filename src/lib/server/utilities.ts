import type { Book, BookDb, SwimWorkout, SwimWorkoutDb } from "$lib/types";

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
    },
  );
  return Array.from(booksMap.values());
};

export const serializeSwimWorkout = (
  swimWorkouts: SwimWorkoutDb[],
): SwimWorkout[] => {
  const map = new Map();
  swimWorkouts.forEach(
    ({
      swimWorkoutId,
      tagId,
      swimWorkoutText,
      yards,
      created,
      tag,
      author,
    }) => {
      const workoutId = swimWorkoutId;
      if (!map.has(workoutId)) {
        map.set(workoutId, {
          id: workoutId,
          swimWorkoutText,
          yards,
          created,
          author,
          tags: [],
        });
      }
      if (tag) map.get(workoutId).tags.push({ id: tagId, tag });
    },
  );
  return Array.from(map.values());
};