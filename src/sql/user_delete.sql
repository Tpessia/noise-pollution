CREATE PROCEDURE `user_delete`(
	IN inUserID VARCHAR(255),
    IN inPassword VARCHAR(255)
)
BEGIN
SELECT u.UserID
FROM User as u
WHERE u.UserID = inUserID AND u.Password = inPassword;

DELETE FROM Track
WHERE UserID = inUserID;

DELETE FROM Playlist
WHERE UserID = inUserID;

DELETE FROM User
WHERE UserID = inUserID AND Password = inPassword;
END