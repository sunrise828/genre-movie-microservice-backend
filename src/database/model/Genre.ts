import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Genre';
export const COLLECTION_NAME = 'genres';

export default interface Genre extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      default: true,
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

export const GenreModel = model<Genre>(DOCUMENT_NAME, schema, COLLECTION_NAME);
