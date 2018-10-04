CREATE PROCEDURE `user_sign_up`(
	IN inUserID VARCHAR(255),
    IN inUsername VARCHAR(255),
    IN inEmail VARCHAR(255),
    IN inPassword VARCHAR(255),
	IN inName VARCHAR(255),
    IN inAvatar VARCHAR(255),
    IN inCreationDate DATETIME
)
BEGIN
INSERT INTO User (UserID, Username, Email, Password, Name, Avatar, CreationDate)
VALUES (inUserID, inUsername, inEmail, inPassword, inName, inAvatar, inCreationDate);

SELECT u.UserID, u.Username, u.Email, u.Name, u.Avatar, u.CreationDate
FROM User as u
WHERE u.UserID = inUserID;
END