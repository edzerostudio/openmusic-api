const config = require('../../utils/config');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const fileLocation = await this._service.writeFile(cover, cover.hapi);
    const fileUrl = config.app.storage === config.storage.local ? `http://${process.env.HOST}:${process.env.PORT}/upload/images/${fileLocation}` : fileLocation;
    await this._albumsService.uploadAlbumCover(id, fileUrl);

    const response = h.response({
      status: 'success',
      message: 'Cover album berhasil diunggah',
      data: {
        fileUrl,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
