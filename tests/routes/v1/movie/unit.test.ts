// importing any mock file let the jest load all the mocks defined in that file
// import the mock for this file below all mock imports
import { mockMovieFindAll, mockMovieCreate, mockMovieFindById, MOVIE_NAME, MOVIE_DESCRIPTION } from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';

const endpoint = '/v1/movie';
const request = supertest(app);

describe('Get all movie route', () => {
  beforeEach(() => {
    mockMovieFindAll.mockClear();
  });

  it('Should send error when over page number is sent', async () => {
    const response:any = await request.get(endpoint).query({pageNumber: 1, pageItemCount: 5});
    expect(response.status).toBe(404);
    expect(mockMovieFindAll).toBeCalled();
  });

  it('Should send success response for correct request', async () => {
    const response:any = await request.get(endpoint).query({pageNumber: 0, pageItemCount: 5});
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(3);
    expect(mockMovieFindAll).toBeCalled();
  });
});