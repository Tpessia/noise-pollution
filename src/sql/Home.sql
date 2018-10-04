CALL _create_tables();

CALL user_sign_up(
	'USERAUTH',
	'tpessia',
    'thiago@pessia.com',
    '123456',
    'Thiago Pessia',
    'public/users/avatars/_default-avatar.jpg',
    '2018-06-16 20:09:00'
);

CALL user_change_password(
	'USERAUTH',
    '123456',
    '654321'
);

CALL user_change_avatar(
	'USERAUTH',
    'public/users/avatars/1.jpg'
);

CALL user_sign_in(
	'tpessia',
    '654321'
);

SELECT *
FROM User;



CALL playlist_create(
	'Playlist 1',
    '2018-06-16 20:10:00',
    'USERAUTH'
);

CALL playlist_rename(
	1,
    'Playlist 2',
    'USERAUTH'
);

CALL playlist_get_all(
	'USERAUTH'
);

CALL playlist_get(
	1,
    'USERAUTH'
);

SELECT *
FROM Playlist;



CALL track_add(
	'Teste1',
    '123456',
    'my-image.jpg',
    '2018-06-17 01:31',
    1,
    'USERAUTH'
);

CALL track_get_all(
	'USERAUTH'
);

CALL track_get(
    1,
    'USERAUTH'
);

CALL track_position(
	1,
    1,
    "down",
    'USERAUTH'
);

CALL track_remove(
	1,
    1,
    'USERAUTH'
);

SELECT *
FROM Track;



CALL playlist_delete(
	1,
    'USERAUTH'
);



CALL user_delete(
	'USERAUTH',
    '654321'
);

DROP TABLE Track;
DROP TABLE Playlist;
DROP TABLE User;