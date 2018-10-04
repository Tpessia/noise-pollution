CREATE PROCEDURE `track_position`(
	IN inTrackID int,
    IN inPlaylistID int,
    IN inDirection VARCHAR(255),
    IN inUserID VARCHAR(255)
)
BEGIN
SELECT t.TrackID, t.Title, t.Video, t.Image, t.AdditionDate, t.Position, t.PlaylistID
FROM Track as t
WHERE t.TrackID = inTrackID AND t.PlaylistID = inPlaylistID;

SET @position = 0;
SET @max_position = 0;
SET @min_position = 0;
SELECT t.Position INTO @position FROM Track as t WHERE t.TrackID = inTrackID;
SELECT MAX(t.TrackID), MIN(t.TrackID) INTO @max_position, @min_position FROM Track as t WHERE t.PlaylistID = inPlaylistID AND t.UserID = inUserID;

UPDATE Track -- prev/next track
SET Position = IF(inDirection = "up", IF(Position + 1 <= @max_position, Position + 1, Position), IF(Position - 1 >= @min_position, Position - 1, Position))
WHERE Position = IF(inDirection = "up", @position - 1, @position + 1) AND PLaylistID = inPlaylistID;

UPDATE Track -- target track
SET Position = IF(inDirection = "up", IF(Position - 1 >= @min_position, Position - 1, Position), IF(Position + 1 <= @max_position, Position + 1, Position))
WHERE TrackID = inTrackID AND PLaylistID = inPlaylistID;
END