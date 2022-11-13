const path = require('path');
const PostgresService = require('./postgres');
const LocalStorageService = require('./storage/StorageService');
const S3StorageService = require('./S3/StorageService');
const ProducerService = require('./rabbitmq/ProducerService');
const config = require('../utils/config');

const {
  authenticationsService,
  usersService,
  collaborationsService,
  playlistsService,
  albumsService,
  songsService,
} = new PostgresService();

let storageService = new LocalStorageService(path.resolve(__dirname, '../api/uploads/file/images'));
switch (config.app.storage) {
  case config.storage.s3:
    storageService = new S3StorageService();
    break;
  case config.storage.local:
  default:
    storageService = new LocalStorageService(path.resolve(__dirname, '../api/uploads/file/images'));
    break;
}
const producerService = ProducerService;

module.exports = {
  authenticationsService,
  usersService,
  collaborationsService,
  playlistsService,
  albumsService,
  songsService,
  storageService,
  producerService,
};
