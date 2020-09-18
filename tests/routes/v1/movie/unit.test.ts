// importing any mock file let the jest load all the mocks defined in that file
// import the mock for this file below all mock imports
import { 
  mockMovieFindAll, 
  mockMovieCreate, 
  mockMovieFindById, 
  mockMovieFindByName,
  MOVIE_LISTS,
  MOVIE_ID,
  MOVIE_NAME, 
  MOVIE_DESCRIPTION } from './mock';
import { GENRE_NAME } from '../genre/mock';
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

describe('Get a movie by id route', () => {
  beforeEach(() => {
    mockMovieFindById.mockClear();
  });

  
  it('Should send error when id is not passed', async () => {
    const response: any = await request.get(`${endpoint}/${MOVIE_ID}`)
    expect(response.status).toBe(400);
    expect(mockMovieFindById).toBeCalled();
  })

  it('Should send success when correct id is passed', async () => {
    const response: any = await request.get(`${endpoint}/${MOVIE_LISTS[0]._id}`)
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data._id).toEqual(MOVIE_LISTS[0]._id.toString());
    expect(response.body.data.name).toEqual(MOVIE_LISTS[0].name);
    expect(response.body.data.description).toEqual(MOVIE_LISTS[0].description);
    expect(response.body.data.duration).toEqual(MOVIE_LISTS[0].duration);
    expect(response.body.data.rating).toEqual(MOVIE_LISTS[0].rating);
    expect(mockMovieFindById).toBeCalled();
  })
})

describe('Get a movie by name route', () => {
  beforeEach(() => {
    mockMovieFindByName.mockClear();
  });

  
  it('Should send error when name is not passed', async () => {
    const response: any = await request.get(`${endpoint}/name`)
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/name/i);
    expect(mockMovieFindByName).not.toBeCalled();
  })

  it('Should send error when wrong name is passed', async () => {
    const response: any = await request.get(`${endpoint}/name`).query({name: 'abc'})
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not registered/i);
    expect(mockMovieFindByName).toBeCalled();
  })

  it('Should send success when correct name is passed', async () => {
    const response: any = await request.get(`${endpoint}/name`).query({name: MOVIE_LISTS[0].name})
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data._id).toEqual(MOVIE_LISTS[0]._id.toString());
    expect(response.body.data.name).toEqual(MOVIE_LISTS[0].name);
    expect(response.body.data.description).toEqual(MOVIE_LISTS[0].description);
    expect(response.body.data.duration).toEqual(MOVIE_LISTS[0].duration);
    expect(response.body.data.rating).toEqual(MOVIE_LISTS[0].rating);
    expect(mockMovieFindById).toBeCalled();
  })
})

describe('Create Movie route', () => {
  beforeEach(() => {
    mockMovieCreate.mockClear();
  });

  it('Should send error when empty body is sent', async () => {
    const response:any = await request.post(endpoint);
    expect(response.status).toBe(400);
    expect(mockMovieCreate).not.toBeCalled();
  });

  it('Should send error when name is not sent', async () => {
    const response:any = await request.post(endpoint).send({
      description: MOVIE_DESCRIPTION
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/name/);
    expect(response.body.message).toMatch(/required/);
    expect(mockMovieCreate).not.toBeCalled();
  });

  it('Should send error when description is not sent', async () => {
    const response:any = await request.post(endpoint).send({
      name: MOVIE_NAME
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/description/);
    expect(response.body.message).toMatch(/required/);
    expect(mockMovieCreate).not.toBeCalled();
  });

  it('Should send success response for correct data', async () => {
    const response:any = await request.post(endpoint).send({
      name: MOVIE_NAME,
      description: MOVIE_DESCRIPTION,
      genreName: GENRE_NAME
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Success/i);
    expect(response.body.data).toBeDefined();

    expect(response.body.data.movie).toHaveProperty('_id');
    expect(response.body.data.movie).toHaveProperty('name');
    expect(response.body.data.movie).toHaveProperty('description');
    
    expect(mockMovieCreate).toBeCalled();
  });
});