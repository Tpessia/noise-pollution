CREATE PROCEDURE `playlist_get`(
    IN inPlaylistID int,
    IN inUserID VARCHAR(255)
)
BEGIN
SELECT p.PlaylistID, p.Name, p.CreationDate
FROM Playlist as p
WHERE p.PlaylistID = inPlaylistID AND p.UserID = inUserID;
END