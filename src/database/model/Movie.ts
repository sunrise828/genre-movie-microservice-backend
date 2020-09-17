import { model, Schema, Document, Types } from 'mongoose';
import Genre from './Genre';

export const DOCUMENT_NAME = 'Movie';
export const COLLECTION_NAME = 'movies';

export default interface Movie extends Document {
  name: string;
  description?: string;
  genres: Genre[];
  duration?: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
      select: false,
    },
    genres: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Genre',
        },
      ],
      required: true,
      select: false,
    },
    duration: {
      type: Schema.Types.Number, // seconds
      default: 0,
    },
    rating: {
      type: Schema.Types.Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const MovieModel = model<Movie>(DOCUMENT_NAME, schema, COLLECTION_NAME);
