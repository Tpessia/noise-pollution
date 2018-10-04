CREATE PROCEDURE `user_change_avatar`(
	IN inUserID VARCHAR(255),
    IN inAvatar VARCHAR(255)
)
BEGIN
UPDATE User
SET Avatar = inAvatar
WHERE UserID = inUserID;

SELECT u.UserID, u.Avatar
FROM User as u
WHERE u.UserID = inUserID;
END