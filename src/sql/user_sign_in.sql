CREATE PROCEDURE `user_sign_in`(
	IN inUsername VARCHAR(255),
    IN inPassword VARCHAR(255)
)
BEGIN
SELECT u.UserID, u.Username, u.Email, u.Name, u.Avatar, u.CreationDate
FROM User as u
WHERE u.Username = inUsername AND u.Password = inPassword;
END