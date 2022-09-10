const AlbumsService = require('./AlbumsService');
const SongsService = require('./SongsService');

const albums = [], songs = [];
class StorageService {
  constructor() {
    this.albums = albums;
    this.songs = songs;

    this.albumsService = new AlbumsService(this);
    this.songsService = new SongsService(this);
  }
}

module.exports = StorageService;
