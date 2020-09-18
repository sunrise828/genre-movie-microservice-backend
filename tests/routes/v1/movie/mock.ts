/* eslint-disable @typescript-eslint/no-unused-vars */
import { Types } from 'mongoose';
import Movie, { MovieModel } from '../../../../src/database/model/Movie';
import Genre from '../../../../src/database/model/Genre';
import { GENRE_ID } from '../genre/mock';

export const MOVIE_NAME = 'abc';
export const MOVIE_DESCRIPTION = 'abc movie description';
export const MOVIE_ID = new Types.ObjectId();
export const OTHER_GENRE_ID = new Types.ObjectId();
export const MOVIE_LISTS:Movie[] = [
  new MovieModel({
    name: 'movie1',
    description: 'movie1 desc',
    genres: [GENRE_ID],
    duration: 90,
    rating: 3
  }),
  new MovieModel({
    name: 'movie2',
    description: 'movie2 desc',
    genres: [GENRE_ID],
    duration: 120,
    rating: 1
  }),
  new MovieModel({
    name: 'movie3',
    description: 'movie3 desc',
    genres: [OTHER_GENRE_ID],
    duration: 75,
    rating: 2
  })
];

export const mockMovieCreate = jest.fn(
  async (
    movie: Movie
  ): Promise<{ movie: Movie }> => {
    movie._id = new Types.ObjectId();
    return {
      movie: movie
    };
  },
);

export const mockMovieFindAll = jest.fn(
  async (pageNumber: Number, limit: Number): Promise<Movie[]> => {
    if (pageNumber == 0 && limit == 5) {
      return MOVIE_LISTS;
    }
    return null;
  },
);

export const mockMovieFindById = jest.fn(
  async (id: Types.ObjectId): Promise<Movie> => {
    if (MOVIE_LISTS[0]._id.equals(id))
      return MOVIE_LISTS[0] as Movie;
    return null;
  },
);

export const mockMovieFindByName = jest.fn(
  async (name: String): Promise<Movie> => {
    if (MOVIE_LISTS[0].name == name)
      return MOVIE_LISTS[0] as Movie;
    return null;
  },
);

jest.mock('../../../../src/database/repository/MovieRepo', () => ({
  get findById() {
    return mockMovieFindById;
  },
  get findByName() {
    return mockMovieFindByName;
  },
  get create() {
    return mockMovieCreate;
  },
  get findAll() {
    return mockMovieFindAll;
  }
}));
