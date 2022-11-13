const asyncForEach = require('async-await-foreach');

class PlaylistsHandler {
  constructor(playlistsService, usersService, validator) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async postPlaylistSongHandler(request, h) {
    await this._validator.validatePlaylistSongPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const id = await this._playlistsService.addPlaylistSong({ playlistId, songId });
    await this._playlistsService.addPlaylistSongActivity({
      playlistId, songId, userId, action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'PlaylistSongs berhasil ditambahkan',
      data: {
        id,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;

    const playlists = await this._playlistsService.getPlaylists(owner);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistSongsHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    let playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsService.getSongsByPlaylistId(playlistId);

    playlist = ({
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs,
    });

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async getPlaylistSongsByUserHandler(request) {
    const { id: userId } = request.auth.credentials;

    const playlists = await this._playlistsService.getPlaylists(userId);
    await asyncForEach(playlists, async (value, key) => {
      const songs = await this._playlistsService.getSongsByPlaylistId(value.id);
      playlists[key] = ({
        id: value.id,
        name: value.name,
        songs,
      });
    });

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistSongActivitiesHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const activities = await this._playlistsService.getActivitiesByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }

  async getPlaylistByIdHandler(request) {
    const { id } = request.params;
    let playlist = await this._playlistsService.getPlaylistById(id);

    playlist = ({
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
    });

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async putPlaylistByIdHandler(request) {
    this._validator.validatePlaylistPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.verifyPlaylistOwner(id, owner);
    await this._playlistsService.editPlaylistById(id, request.payload);

    return {
      status: 'success',
      message: 'Playlist berhasil diperbarui',
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.verifyPlaylistOwner(id, owner);
    await this._playlistsService.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async deletePlaylistSongHandler(request) {
    await this._validator.validatePlaylistSongPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._playlistsService.deletePlaylistSong(playlistId, songId);
    await this._playlistsService.addPlaylistSongActivity({
      playlistId, songId, userId, action: 'delete',
    });

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
