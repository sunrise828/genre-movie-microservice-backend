/* eslint-disable @typescript-eslint/no-unused-vars */
import Genre from '../../../../src/database/model/Genre';
import { Types } from 'mongoose';

export const GENRE_NAME = 'abc';
export const GENRE_DESCRIPTION = 'abc genre description';
export const GENRE_ID = new Types.ObjectId();

export const mockGenreCreate = jest.fn(
  async (
    genre: Genre
  ): Promise<{ genre: Genre }> => {
    genre._id = new Types.ObjectId();
    return {
      genre: genre
    };
  },
);

export const mockGenreFindById = jest.fn(
  async (id: Types.ObjectId): Promise<Genre> => {
    if (GENRE_ID.equals(id))
      return {
        _id: GENRE_ID,
        name: GENRE_NAME,
        description: GENRE_DESCRIPTION,
      } as Genre;
    return null;
  },
);

jest.mock('../../../../src/database/repository/GenreRepo', () => ({
  get findById() {
    return mockGenreFindById;
  },
  get create() {
    return mockGenreCreate;
  },
}));
