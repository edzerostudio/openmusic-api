const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor(storage) {
    this.songs = storage.songs;
    this.albums = storage.albums;
  }

  addSong({
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const id = 'song-'.concat(nanoid(16));

    const newSong = {
      title, year, genre, performer, duration, albumId, id,
    };

    this.songs.push(newSong);

    const isSuccess = this.songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return id;
  }

  getSongs(param) {
    let songs = this.songs, length = Object.keys(param).length;
    
    if(length) {
      for (const [key, value] of Object.entries(param)) {
        if (typeof value !== 'undefined') {
          songs = songs.filter((n) => n[key].toLowerCase().indexOf(value.toLowerCase()) >= 0);
        }
      }
    }
    return songs;
  }

  getSongById(id) {
    const song = this.songs.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const index = this.songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }

    this.songs[index] = {
      ...this.songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const index = this.songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
    this.songs.splice(index, 1);
  }
}

module.exports = SongsService;
