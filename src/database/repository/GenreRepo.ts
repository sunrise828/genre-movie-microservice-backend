import Genre, { GenreModel } from '../model/Genre';
import { Types } from 'mongoose';

export default class GenreRepo {
  public static findById(id: Types.ObjectId): Promise<Genre> {
    return GenreModel.findOne({ _id: id }).lean<Genre>().exec();
  }

  public static findAll(
    pageNumber: number,
    limit: number,
  ): Promise<Genre[]> {
    return GenreModel.find({status: true})
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean<Genre>()
      .exec();
  }

  public static findByName(name: string): Promise<Genre> {
    return GenreModel.findOne({ name: name, status: true }).lean<Genre>().exec();
  }

  public static async create(genre: Genre): Promise<Genre> {
    const now = new Date();
    genre.createdAt = now;
    genre.updatedAt = now;
    const createdGenre = await GenreModel.create(genre);
    return createdGenre.toObject();
  }

  public static async update(
    Genre: Genre
  ): Promise<{ Genre: Genre }> {
    Genre.updatedAt = new Date();
    await GenreModel.updateOne({ _id: Genre._id }, { $set: { ...Genre } })
      .lean()
      .exec();
    return { Genre: Genre };
  }
}
