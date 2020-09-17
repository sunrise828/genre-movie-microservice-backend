import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import GenreRepo from '../../../database/repository/GenreRepo';
import { NoDataError, BadRequestError } from '../../../core/ApiError';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import Genre from '../../../database/model/Genre';

const router = express.Router();

// get item by id
router.get(
  '/:id',
  validator(schema.withId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const genre = await GenreRepo.findById(new Types.ObjectId(req.params.id));
    if (!genre) throw new BadRequestError('Genre not registered');
    return new SuccessResponse('success', _.pick(genre, ['name', 'description'])).send(res);
  }),
);

// get item by id
router.get(
  '/name',
  validator(schema.withName, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const genre = await GenreRepo.findByName(req.query.name);
    if (!genre) throw new BadRequestError('Genre not registered');
    return new SuccessResponse('success', _.pick(genre, ['name', 'description'])).send(res);
  }),
);

// get all items
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const genres = await GenreRepo.findAll(
      parseInt(req.query.pageNumber),
      parseInt(req.query.pageItemCount),
    )
    // if (!genres || genres.length < 1) throw new NoDataError();
    return new SuccessResponse('success', genres).send(res);
  }),
);

// create new item
router.post(
  '/',
  validator(schema.withInfo),
  asyncHandler(async (req, res) => {    
    const createdGenre = await GenreRepo.create({
      name: req.body.name,
      description: req.body.description
    } as Genre);

    new SuccessResponse('Genre created successfully', createdGenre).send(res);
  }),
);

router.put(
  '/',
  validator(schema.updateInfo),
  asyncHandler(async (req, res) => {
    const genre = await GenreRepo.findById(req.body.id);
    if (!genre) throw new BadRequestError('Genre not registered');

    if (req.body.name) genre.name = req.body.name;
    if (req.body.description) genre.description = req.body.description;

    await GenreRepo.update(genre);
    return new SuccessResponse(
      'Genre updated',
      _.pick(genre, ['name', 'description']),
    ).send(res);
  }),
);

export default router;
