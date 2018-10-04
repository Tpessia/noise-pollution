CREATE PROCEDURE `playlist_rename`(
	IN inPlaylistID int,
    IN inNewName VARCHAR(255),
    IN inUserID VARCHAR(255)
)
BEGIN
UPDATE Playlist
SET Name = inNewName
WHERE PlaylistID = inPlaylistID AND UserID = inUserID;

SELECT p.PlaylistID, p.Name, p.CreationDate
FROM Playlist as p
WHERE p.PlaylistID = inPlaylistID AND p.UserID = inUserID;
END