const { Pool } = require('pg');
const AlbumsService = require('./AlbumsService');
const SongsService = require('./SongsService');

class StorageService {
  constructor() {
    this.pool = new Pool();

    this.albumsService = new AlbumsService(this);
    this.songsService = new SongsService(this);
  }
}

module.exports = StorageService;
