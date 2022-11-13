class ExportsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._validator = validator;
  }

  async postExportPlaylistSongsHandler(request, h) {
    this._validator.validateExportPlaylistSongsPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const message = {
      userId: request.auth.credentials.id,
      playlistId: request.params.playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistService.verifyPlaylistAccess(message.playlistId, owner);
    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
