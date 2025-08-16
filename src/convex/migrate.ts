// import { mutation } from './_generated/server';
// import type { Doc } from './_generated/dataModel';

// export const association = mutation({
// 	handler: async (ctx) => {
// 		const booksArr = await ctx.db.query('Books').collect();
// 		const genresArr = await ctx.db.query('Genres').collect();
// 		const associations = await ctx.db.query('tempA').collect();

// 		let books: Map<number, Doc<'Books'>> = new Map();
// 		let genres: Map<number, Doc<'Genres'>> = new Map();

// 		for (let i = 0; i < booksArr.length; i++) {
// 			const element = booksArr[i];
// 			const bookId = element.id;
// 			if (bookId) {
// 				books.set(bookId, element);
// 			}
// 		}
// 		for (let i = 0; i < genresArr.length; i++) {
// 			const e = genresArr[i];
// 			const tagId = e.id;
// 			if (tagId) {
// 				genres.set(tagId, e);
// 			}
// 		}

// 		for (let i = 0; i < associations.length; i++) {
// 			const element = associations[i];
// 			const genreId = element.genreId;
// 			const bookId = element.bookId;
// 			const cGenreId = genres.get(genreId)?._id;
// 			const cBookId = books.get(bookId)?._id;
// 			if (cGenreId && cBookId) {
// 				await ctx.db.insert('Books_Genres_Association', {
// 					bookId: cBookId,
// 					genreId: cGenreId
// 				});
// 			}
// 		}
// 	}
// });

// export const deleteUneededColumns = mutation({
// 	handler: async (ctx) => {
// 		const books = await ctx.db.query('Books').collect();
// 		const genres = await ctx.db.query('Genres').collect();

// 		for (let i = 0; i < books.length; i++) {
// 			const element = books[i];
// 			await ctx.db.patch(element._id, {
// 				id: undefined
// 			});
// 		}
// 		for (let i = 0; i < genres.length; i++) {
// 			const element = genres[i];
// 			await ctx.db.patch(element._id, {
// 				id: undefined
// 			});
// 		}
// 	}
// });
