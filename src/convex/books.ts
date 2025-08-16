import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { bookFullFields, bookFullUpdateFields, BookTypeFull } from './schema';

export const getAll = query({
	handler: async (ctx) => {
		let booksFull: BookTypeFull[] = [];

		const books = await ctx.db.query('Books').order('desc').collect();
		const genres = await ctx.db.query('Genres').collect();

		for (let i = 0; i < books.length; i++) {
			const e = books[i];
			const bookGenres = await ctx.db
				.query('Books_Genres_Association')
				.withIndex('by_book', (q) => q.eq('bookId', e._id))
				.collect();
			const genreObjects = genres.filter((genre) =>
				bookGenres.some((bg) => bg.genreId === genre._id)
			);

			booksFull.push({
				...e,
				genres: genreObjects
			});
		}

		return booksFull;
	}
});

export const get = query({
	args: {
		bookId: v.id('Books')
	},
	handler: async (ctx, args) => {
		const { bookId } = args;
		const book = await ctx.db.get(bookId);
		if (!book) throw new Error(`Book with id ${bookId} not found`);

		let genres = [];

		const associations = await ctx.db
			.query('Books_Genres_Association')
			.withIndex('by_book', (q) => q.eq('bookId', bookId))
			.collect();

		for (let i = 0; i < associations.length; i++) {
			const e = associations[i];
			const genreObject = await ctx.db.get(e.genreId);
			if (genreObject) genres.push(genreObject?._id);
		}

		return {
			...book,
			genres
		};
	}
});

export const insert = mutation({
	args: bookFullFields,
	handler: async (ctx, args) => {
		const { genres, ...bookData } = args;
		const bookId = await ctx.db.insert('Books', bookData);

		for (let i = 0; i < genres.length; i++) {
			const e = genres[i];
			await ctx.db.insert('Books_Genres_Association', {
				bookId,
				genreId: e
			});
		}

		return bookId;
	}
});

export const update = mutation({
	args: bookFullUpdateFields,
	handler: async (ctx, args) => {
		const { id, genres, ...bookData } = args;

		//UPDATE THE BOOK
		await ctx.db.patch(id, bookData);

		//DELETE ALL CURRENT GENRES
		const currentGenres = await ctx.db
			.query('Books_Genres_Association')
			.withIndex('by_book', (q) => q.eq('bookId', id))
			.collect();
		for (let i = 0; i < currentGenres.length; i++) {
			const e = currentGenres[i];
			await ctx.db.delete(e._id);
		}

		//RECREATE ALL GENRES
		for (let i = 0; i < genres.length; i++) {
			const e = genres[i];
			await ctx.db.insert('Books_Genres_Association', {
				bookId: id,
				genreId: e
			});
		}

		return {
			success: true
		};
	}
});

export const deleteBook = mutation({
	args: { bookId: v.id('Books') },
	handler: async (ctx, args) => {
		const { bookId } = args;
		const genres = await ctx.db
			.query('Books_Genres_Association')
			.withIndex('by_book', (q) => q.eq('bookId', bookId))
			.collect();

		for (let i = 0; i < genres.length; i++) {
			const e = genres[i];
			await ctx.db.delete(e._id);
		}

		await ctx.db.delete(bookId);
		return {
			success: true
		};
	}
});
