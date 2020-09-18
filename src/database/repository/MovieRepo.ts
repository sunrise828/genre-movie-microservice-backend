import Movie, { MovieModel } from '../model/Movie';
import Genre, { GenreModel } from '../model/Genre';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';

export default class MovieRepo {
  // contains critical information of the Movie
  public static findById(id: Types.ObjectId): Promise<Movie> {
    return MovieModel.findOne({ _id: id })
      // .select('+_id +name +description +duration +rate +createdAt +updatedAt')
      .populate({
        path: 'genres'
      })
      .lean<Movie>()
      .exec();
  }

  public static findByName(name: string): Promise<Movie> {
    return MovieModel.findOne({ name: name })
      .select('+name +description +duration +rate')
      .populate({
        path: 'genres',
        select: { name: 1 },
      })
      .lean<Movie>()
      .exec();
  }

  public static async create(
    Movie: Movie,
    genreName: string,
  ): Promise<{ Movie: Movie }> {
    const now = new Date();

    const genre = await GenreModel.findOne({ name: genreName })
      .select('+name +description')
      .lean<Genre>()
      .exec();
    if (!genre) throw new InternalError('Role must be defined');

    Movie.genres = [genre._id];
    Movie.createdAt = Movie.updatedAt = now;
    const createdMovie = await MovieModel.create(Movie);
    return { Movie: createdMovie.toObject() };
  }

  public static async update(
    Movie: Movie
  ): Promise<{ Movie: Movie }> {
    Movie.updatedAt = new Date();
    await MovieModel.updateOne({ _id: Movie._id }, { $set: { ...Movie } })
      .lean()
      .exec();
    return { Movie: Movie };
  }
  
  public static findAll(
    pageNumber: number,
    limit: number,
  ): Promise<Movie[]> {
    return MovieModel.find({})
      .populate({
        path: 'genres',
        select: { name: 1 },
      })
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean<Movie>()
      .exec();
  }
}
