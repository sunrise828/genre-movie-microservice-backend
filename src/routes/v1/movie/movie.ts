import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import MovieRepo from '../../../database/repository/MovieRepo';
import GenreRepo from '../../../database/repository/GenreRepo';
import { NoDataError, BadRequestError } from '../../../core/ApiError';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import Movie from '../../../database/model/Movie';

const router = express.Router();

// get item by name
router.get(
  '/name',
  validator(schema.withName, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const movie = await MovieRepo.findByName(req.query.name);
    if (!movie) throw new BadRequestError('Movie not registered');
    return new SuccessResponse('success', movie as Movie).send(res);
  }),
);

// get item by id
router.get(
  '/:id',
  validator(schema.withId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const movie = await MovieRepo.findById(new Types.ObjectId(req.params.id));
    if (!movie) throw new BadRequestError('Movie not registered');
    return new SuccessResponse('success', movie as Movie).send(res);
  }),
);

// get all items
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const movies = await MovieRepo.findAll(
      parseInt(req.query.pageNumber),
      parseInt(req.query.pageItemCount),
    )
    if (!movies || movies.length < 1) throw new NoDataError();
    return new SuccessResponse('success', movies).send(res);
  }),
);

// create new item
router.post(
  '/',
  validator(schema.withInfo),
  asyncHandler(async (req, res) => {    
    const createdMovie = await MovieRepo.create(
      {
        name: req.body.name,
        description: req.body.description,
        duration: req.body.duration,
        rating: req.body.rating
      } as Movie,
      req.body.genreName as string
    );

    new SuccessResponse('Movie created successfully', createdMovie).send(res);
  }),
);

router.put(
  '/',
  validator(schema.updateInfo),
  asyncHandler(async (req, res) => {
    const movie = await MovieRepo.findById(req.body.id);
    if (!movie) throw new BadRequestError('Movie not registered');

    if (req.body.name) movie.name = req.body.name;
    if (req.body.description) movie.description = req.body.description;
    if (req.body.duration) movie.duration = req.body.duration;
    if (req.body.rating) movie.rating = req.body.rating;
    if (req.body.genreName) {
      const genre = await GenreRepo.findByName(req.body.genreName);
      if (genre) {
        movie.genres.push(genre._id);
      }
    }

    await MovieRepo.update(movie);
    return new SuccessResponse(
      'Movie updated',
      movie,
    ).send(res);
  }),
);

export default router;
