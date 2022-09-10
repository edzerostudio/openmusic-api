const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(storage) {
    this.songsService = storage.songsService;
    
    this.albums = storage.albums;
    this.songs = storage.songs;
  }

  addAlbum({ name, year }) {
    const id = 'album-'.concat(nanoid(16));

    const newAlbum = {
      name, year, id,
    };

    this.albums.push(newAlbum);

    const isSuccess = this.albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbums() {
    return this.albums;
  }

  findAlbum(id) {
    const album = this.albums.filter((n) => n.id === id)[0];
    return album??false;
  }


  getAlbumById(id) {
    const album = this.albums.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return album;
  }

  getSongsByAlbumId(id) {
    const song = this.songs.filter((n) => n.albumId === id);
    if (!song) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return song;
  }

  editAlbumById(id, { name, year }) {
    const index = this.albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }

    this.albums[index] = {
      ...this.albums[index],
      name,
      year,
    };
  }

  deleteAlbumById(id) {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    let songs = this.getSongsByAlbumId(id);
    songs.forEach( (element, index) => {
      this.songs[index] = {
        ...this.songs[index],
        'albumId': null
      };
    });
    
    this.albums.splice(index, 1);
  }
}

module.exports = AlbumsService;
