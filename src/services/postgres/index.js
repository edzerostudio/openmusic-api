const { Pool } = require('pg');
const CacheService = require('../redis/CacheService');
const AuthenticationsService = require('./AuthenticationsService');
const UsersService = require('./UsersService');
const CollaborationsService = require('./CollaborationsService');
const PlaylistsService = require('./PlaylistsService');
const AlbumsService = require('./AlbumsService');
const SongsService = require('./SongsService');

class StorageService {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();

    this.authenticationsService = new AuthenticationsService(this);
    this.usersService = new UsersService(this);
    this.collaborationsService = new CollaborationsService(this);
    this.playlistsService = new PlaylistsService(this);
    this.albumsService = new AlbumsService(this);
    this.songsService = new SongsService(this);
  }
}

module.exports = StorageService;
