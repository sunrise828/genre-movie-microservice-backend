import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  withId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  withName: Joi.object().keys({
    name: Joi.string().required().min(1).max(200),
  }),
  withInfo: Joi.object().keys({
    name: Joi.string().required().min(1).max(200),
    description: Joi.string().required().min(1).max(600),
    duration: Joi.number().optional(),
    rating: Joi.number().optional(),
    genreName: Joi.string().required().min(1).max(200),
  }),
  updateInfo: Joi.object().keys({
    id: JoiObjectId().required(),
    name: Joi.string().optional().min(1).max(200),
    description: Joi.string().optional().min(1).max(600),
    duration: Joi.number().optional(),
    rating: Joi.number().optional(),
    genreName: Joi.string().optional().min(1).max(200),
  }),
};
