const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor(storage) {
    this._pool = storage._pool;
  }

  async addSong({
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const id = 'song-'.concat(nanoid(16));

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(param) {
    let text = 'SELECT * FROM songs', values = [];
    const length = Object.keys(param).length;

    if(length) {
      text = text.concat(' WHERE ');
      let index = 0;
      for (const [key, value] of Object.entries(param)) {
        if (typeof value !== 'undefined') {
          index++;
          text = text.concat(`${key} ILIKE '%'||$${index}||'%'`);
          values.push(value);
        }
        if (index > 0 && index != length) {
          text = text.concat(' AND ');
        }
      }
    }

    const query = {text, values};
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async checkSong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows.length > 0 ? true : false;
  }

  async editSongById(id, {
    title, year, genre, performer, duration = null, album_id = null,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "album_id" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, album_id, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
