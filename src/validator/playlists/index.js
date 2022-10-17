const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistSongPayload: async (payload) => {
    const validationAsyncResult = await PlaylistSongPayloadSchema.validateAsync(payload)
    .catch (error => {
      if(error instanceof NotFoundError) {
        throw new NotFoundError(error.message);
      } else {
        throw new InvariantError(error.message);  
      }
    });

    return validationAsyncResult;
  },
};

module.exports = PlaylistsValidator;
