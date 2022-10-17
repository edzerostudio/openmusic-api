const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { CollaborationPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validateCollaborationPayload: async (payload) => {
    const validationAsyncResult = await CollaborationPayloadSchema.validateAsync(payload)
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

module.exports = CollaborationsValidator;
