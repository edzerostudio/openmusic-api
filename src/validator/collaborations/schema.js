const Joi = require('joi');
const NotFoundError = require('../../exceptions/NotFoundError');
const { playlistsService, usersService } = require('../../services');

const checkPlaylist = async (value) => {
  if (typeof value !== 'undefined' && value !== null) {
    const playlist = await playlistsService.checkPlaylist(value);
    if (!playlist) {
      throw new NotFoundError('"playlistId " not found');
    }
  }
};

const checkUser = async (value) => {
  if (typeof value !== 'undefined' && value !== null) {
    const user = await usersService.checkUser(value);
    if (!user) {
      throw new NotFoundError('"userId" not found');
    }
  }
};

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required().external(checkPlaylist),
  userId: Joi.string().required().external(checkUser),
});

module.exports = { CollaborationPayloadSchema };
