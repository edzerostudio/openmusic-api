const Joi = require('joi');
const NotFoundError = require('../../exceptions/NotFoundError');
const { songsService } = require('../../services');

const checkSong = async (value) => {
    if (typeof value !== 'undefined' && value !== null) {
        let song = await songsService.checkSong(value);
        if (!song) {
            throw new NotFoundError('\"songId"\ not found');
        }
    }
};

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required().external(checkSong),
});

module.exports = { PlaylistPayloadSchema, PlaylistSongPayloadSchema };
