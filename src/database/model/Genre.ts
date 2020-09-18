import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Genre';
export const COLLECTION_NAME = 'genres';

export default interface Genre extends Document {
  name: string;
  description?: string;
  status?: Boolean;
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
    status: {
      type: Boolean,
      default: true,
      select: false
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
