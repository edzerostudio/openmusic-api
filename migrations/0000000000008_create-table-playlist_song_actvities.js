exports.up = (pgm) => {
  // membuat table playlist_song_activities
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  /*
    Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan user_id.
    Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus tabel playlist_song_activities
  pgm.dropTable('playlist_song_activities');
};
