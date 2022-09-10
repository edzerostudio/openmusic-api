const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema, SongSearchPayloadSchema } = require('./schema');

const SongsValidator = {
  validateSongPayload: async (payload) => {
    const validationAsyncResult = await SongPayloadSchema.validateAsync(payload)
    .catch (error => {
      throw new InvariantError(error.message);
    });

    return validationAsyncResult;
  },

  validateSongSearchPayload: (payload) => {
    const validationResult = SongSearchPayloadSchema.validate(payload)
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = SongsValidator;
