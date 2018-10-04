CREATE PROCEDURE `playlist_get_all` (
	IN inUserID VARCHAR(255)
)
BEGIN
SELECT p.PlaylistID, p.Name, p.CreationDate
FROM Playlist as p
WHERE p.UserID = inUserID;
END
