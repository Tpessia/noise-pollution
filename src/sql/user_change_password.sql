CREATE PROCEDURE `user_change_password`(
	IN inUserID VARCHAR(255),
    IN inOldPassword VARCHAR(255),
    IN inNewPassword VARCHAR(255)
)
BEGIN
UPDATE User
SET Password = inNewPassword
WHERE UserID = inUserID AND Password = inOldPassword;

SELECT u.UserID
FROM User as u
WHERE u.UserID = inUserID AND u.Password = inNewPassword;
END