const Joi = require('joi');
const NotFoundError = require('../../exceptions/NotFoundError');
const { albumsService } = require('../../services');

const checkAlbum = async (value) => {
  if (typeof value !== 'undefined' && value !== null) {
    const album = await albumsService.checkAlbum(value);
    if (!album) {
      throw new NotFoundError('"albumId" not found');
    }
  }
};

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().optional(),
  albumId: Joi.string().optional().external(checkAlbum),
});

const SongSearchPayloadSchema = Joi.object({
  title: Joi.string().optional(),
  performer: Joi.string().optional(),
});

module.exports = { SongPayloadSchema, SongSearchPayloadSchema };
