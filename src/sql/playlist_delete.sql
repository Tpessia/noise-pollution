CREATE PROCEDURE `playlist_delete`(
	IN inPlaylistID int,
    IN inUserID VARCHAR(255)
)
BEGIN
SELECT p.PlaylistID, p.Name, p.CreationDate
FROM Playlist as p
WHERE p.PlaylistID = inPlaylistID AND p.UserID = inUserID;

DELETE FROM Track
WHERE PlaylistID = inPlaylistID AND UserID = inUserID;

DELETE FROM Playlist
WHERE PlaylistID = inPlaylistID AND UserID = inUserID;
END