import express from 'express';
import genre from './genre/genre';
import movie from './movie/movie';

const router = express.Router();

router.use('/genre', genre);
router.use('/movie', movie);

export default router;
