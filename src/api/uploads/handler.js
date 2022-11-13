const config = require('../../utils/config');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const fileLocation = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        fileUrl: config.app.storage === config.storage.local ? `http://${process.env.HOST}:${process.env.PORT}/upload/images/${fileLocation}` : fileLocation,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
