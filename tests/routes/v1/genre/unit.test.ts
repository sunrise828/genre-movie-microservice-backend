// importing any mock file let the jest load all the mocks defined in that file
// import the mock for this file below all mock imports
import { mockGenreCreate, mockGenreFindById, GENRE_NAME, GENRE_DESCRIPTION } from './mock';

import supertest from 'supertest';
import app from '../../../../src/app';

describe('Create genre route', () => {
  const endpoint = '/v1/genre';
  const request = supertest(app);

  beforeEach(() => {
    mockGenreFindById.mockClear();
    mockGenreCreate.mockClear();
  });

  it('Should send error when empty body is sent', async () => {
    const response:any = await request.post(endpoint);
    expect(response.status).toBe(400);
    expect(mockGenreFindById).not.toBeCalled();
    expect(mockGenreCreate).not.toBeCalled();
  });

  it('Should send error when name is not sent', async () => {
    const response:any = await request.post(endpoint).send({
      description: GENRE_DESCRIPTION
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/name/);
    expect(response.body.message).toMatch(/required/);
    expect(mockGenreFindById).not.toBeCalled();
    expect(mockGenreCreate).not.toBeCalled();
  });

  it('Should send error when description is not sent', async () => {
    const response:any = await request.post(endpoint).send({
      name: GENRE_NAME
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/description/);
    expect(response.body.message).toMatch(/required/);
    expect(mockGenreFindById).not.toBeCalled();
    expect(mockGenreCreate).not.toBeCalled();
  });

  it('Should send success response for correct data', async (done) => {
    const response:any = await request.post(endpoint).send({
      name: GENRE_NAME,
      description: GENRE_DESCRIPTION,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Success/i);
    expect(response.body.data).toBeDefined();

    expect(response.body.data.genre).toHaveProperty('_id');
    expect(response.body.data.genre).toHaveProperty('name');
    expect(response.body.data.genre).toHaveProperty('description');
    
    expect(mockGenreCreate).toBeCalled();
    done();
  });
});
