CREATE PROCEDURE `playlist_create`(
	IN inName VARCHAR(255),
    IN inCreationDate DATETIME,
    IN inUserID VARCHAR(255)
)
BEGIN
INSERT INTO Playlist (Name, CreationDate, UserID)
VALUES (inName, inCreationDate, inUserID);

SELECT p.PlaylistID, p.Name, p.CreationDate
FROM Playlist as p
WHERE p.Name = inName AND p.UserID = inUserId;
END