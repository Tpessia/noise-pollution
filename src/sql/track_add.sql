CREATE PROCEDURE `track_add`(
	IN inTitle VARCHAR(255),
    IN inVideo VARCHAR(255),
    IN inImage VARCHAR(255),
    IN inAdditionDate DATETIME,
    IN inPlaylistID int,
    IN inUserID VARCHAR(255)
)
BEGIN
INSERT INTO Track (Title, Video, Image, AdditionDate, PlaylistID, UserID)
VALUES (inTitle, inVideo, inImage, inAdditionDate, inPlaylistID, inUserID);

SET @track_id = LAST_INSERT_ID();

UPDATE Track
SET Position = @track_id
WHERE TrackID = @track_id;

SELECT t.TrackID, t.Title, t.Video, t.Image, t.AdditionDate, t.Position, t.PlaylistID
FROM Track as t
WHERE t.TrackID = @track_id AND t.PlaylistID = inPlaylistID;
END