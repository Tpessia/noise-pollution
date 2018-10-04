CREATE PROCEDURE `track_get`(
	IN inPlaylistID int,
    IN inUserID VARCHAR(255)
)
BEGIN
SELECT t.TrackID, t.Title, t.Video, t.Image, t.AdditionDate, t.Position, t.PlaylistID
FROM Track as t
WHERE t.PlaylistID = inPlaylistID AND t.UserID = inUserID;
END