CREATE PROCEDURE `_create_tables`()
BEGIN
CREATE TABLE IF NOT EXISTS User (

    UserID VARCHAR(255) NOT NULL PRIMARY KEY,
    
    Username VARCHAR(255) NOT NULL,
    
    Email VARCHAR(255) NOT NULL,
    
    Password VARCHAR(255) NOT NULL,
    
    Name VARCHAR(255) NOT NULL,
    
    Avatar VARCHAR(255) NOT NULL,

    CreationDate DATETIME NOT NULL,
    
    CONSTRAINT UC_Username UNIQUE (Username),
    CONSTRAINT UC_Email UNIQUE (Email)
    
);

CREATE TABLE IF NOT EXISTS Playlist (

    PlaylistID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    Name VARCHAR(255) NOT NULL,

    CreationDate DATETIME NOT NULL,

	UserID VARCHAR(255) NOT NULL,
       
    CONSTRAINT FK_UserPlaylist FOREIGN KEY (UserID) REFERENCES User(UserID),
    CONSTRAINT UC_NameUserID UNIQUE (Name,UserID)

);

CREATE TABLE IF NOT EXISTS Track (

    TrackID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    Title VARCHAR(255) NOT NULL,

    Video VARCHAR(255) NOT NULL,

	Image VARCHAR(255) NOT NULL,
    
	AdditionDate DATETIME NOT NULL,
    
    Position int NOT NULL,
    
    PlaylistID int NOT NULL,
    
    UserID VARCHAR(255) NULL,
        
    CONSTRAINT FK_PlaylistTrack FOREIGN KEY (PlaylistID) REFERENCES Playlist(PlaylistID),
    CONSTRAINT FK_UserTrack FOREIGN KEY (UserID) REFERENCES User(UserID)

);
END