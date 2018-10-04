CREATE PROCEDURE `track_remove`(
	IN inTrackID int,
    IN inPlaylistID int,
    IN inUserID VARCHAR(255)
)
BEGIN
SELECT t.TrackID, t.Title, t.Video, t.Image, t.AdditionDate, t.Position, t.PlaylistID
FROM Track as t
WHERE t.TrackID = inTrackID AND t.PlaylistID = inPlaylistID AND t.UserID = inUserID;

DELETE FROM Track
WHERE TrackID = inTrackID AND PlaylistID = inPlaylistID AND UserID = inUserID;
END