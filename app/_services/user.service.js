app.service("userService", function ($rootScope, $http) {

    var self = this;
    
    // User

    this.user = {
        isLogged: false,
        avatar: null,
        name: null,
        email: null
    };

    this.userSecure = {
        username: null,
        userId: null
    };

    this.signUp = function (data) {
        if (typeof data !== "undefined") {
            return $http.post($rootScope.baseUrl + 'src/php/user.signup.php', data).then(function (response) {
                if (typeof response.data.UserID !== "undefined") {
                    $http.post($rootScope.baseUrl + 'src/php/session.create.php', data);
                }
                
                return response;
            }, function (errResponse) {
                console.log(errResponse);
                
                return errResponse;
            });
        }
        else {
            return new Promise(
                function (resolve, reject) {
                    resolve({data:'0'});
                }
            );
        }
    };

    this.signIn = function (data) {
        if (typeof data !== "undefined") {
            return $http.post($rootScope.baseUrl + 'src/php/user.signin.php', data).then(function (response) {
                if (typeof response.data.UserID !== "undefined") {
                    $http.post($rootScope.baseUrl + 'src/php/session.create.php', data);
                }
                
                return response;
            }, function (errResponse) {
                console.log(errResponse);
                
                return errResponse;
            });
        }
        else {
            return new Promise(
                function (resolve, reject) {
                    resolve({data:'0'});
                }
            );
        }
    };

    this.logOut = function () {
        return $http.post($rootScope.baseUrl + 'src/php/session.delete.php').then(function (response) {
            return response;
        }, function (errResponse) {
            return errResponse;
        });
    };

    this.sessionLogin = function () {
        return $http.post($rootScope.baseUrl + 'src/php/session.login.php');
    };

    // Change settings

    this.changeAvatar = function (data) {
        return $http.post($rootScope.baseUrl + 'src/php/settings.avatar.php', data);
    };

    this.changeName = function (data) {
        return $http.post($rootScope.baseUrl + 'src/php/settings.name.php', data);
    };

    this.changePassword = function (data) {
        return $http.post($rootScope.baseUrl + 'src/php/settings.password.php', data);
    };

    this.deleteAccount = function (data) {
        return $http.post($rootScope.baseUrl + 'src/php/user.delete.php', data);
    }

    // Playlists

    this.savedPlaylistsArray = [/*{
            playlistId: '111',
            name: 'myPlaylist1',
            date: new Date('2018-06-14T14:30:00'),
            list: [{
                trackId: '111',
                videoId: 'VYOjWnS4cMY',
                title: 'Childish Gambino - This Is America (Official Video)',
                img: 'https://pbs.twimg.com/profile_images/758084549821730820/_HYHtD8F.jpg',
                date: new Date('2018-06-14T14:30:10')
            }, {
                trackId: '222',
                videoId: '71Es-8FfATo',
                title: 'Arctic Monkeys - Four Out Of Five (Official Video)',
                img: 'https://pbs.twimg.com/profile_images/758084549821730820/_HYHtD8F.jpg',
                date: new Date('2018-06-14T14:30:20')
            }]
        }, {
            playlistId: '222',
            name: 'myPlaylist2',
            date: new Date('2018-06-14T14:31:00'),
            list: [{
                trackId: '333',
                videoId: 'VYOjWnS4cMY',
                title: 'Childish Gambino - This Is America (Official Video)',
                img: 'https://pbs.twimg.com/profile_images/758084549821730820/_HYHtD8F.jpg',
                date: new Date('2018-06-14T14:31:10')
            }, {
                trackId: '444',
                videoId: '71Es-8FfATo',
                title: 'Arctic Monkeys - Four Out Of Five (Official Video)',
                img: 'https://pbs.twimg.com/profile_images/758084549821730820/_HYHtD8F.jpg',
                date: new Date('2018-06-14T14:31:20')
            }]
        }, {
            playlistId: '333',
            name: 'myPlaylist3',
            date: new Date('2018-06-14T14:32:00'),
            list: []
        }
    */];

    this.savedPlaylists = {
        loadPlaylists: function () {
            if (self.user.isLogged) {
                return $http.post($rootScope.baseUrl + 'src/php/track.getall.php', {
                    user: self.userSecure.userId
                }).then(function (response) {
                    if (typeof response.data !== "undefined" && typeof response.data === "object") {
                        var rawPlaylists = response.data,
                            playlist = [];
                        for (var i in rawPlaylists) {
                            playlist[i] = {
                                playlistId: rawPlaylists[i].PlaylistID,
                                name: rawPlaylists[i].Name,
                                list: [],
                                date: new Date(rawPlaylists[i].CreationDate),
                            }

                            for (var j in rawPlaylists[i].list) {
                                var list = rawPlaylists[i].list[j];
                                playlist[i].list.push({
                                    trackId: list.TrackID,
                                    videoId: list.Video,
                                    title: list.Title,
                                    img: list.Image,
                                    date: new Date(list.AdditionDate),
                                    position: list.Position
                                });

                                playlist[i].list.sort(function (a,b) { return parseInt(a.position) - parseInt(b.position)});
                            }
                        }

                        self.savedPlaylistsArray = playlist;
                    }
                    else {
                        console.log(response);
                    }
                    
                    return response;
                }, function (errResponse) {
                    console.log(errResponse);

                    return response;
                });
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        newPlaylist: function (playlistName) {
            if (self.user.isLogged && !this.playlistExistsName(playlistName)) {
                return $http.post($rootScope.baseUrl + 'src/php/playlist.create.php', {
                    name: playlistName,
                    user: self.userSecure.userId
                }).then(function (response) {
                    if (typeof response.data.PlaylistID !== "undefined") {
                        self.savedPlaylistsArray.push({
                            playlistId: response.data.PlaylistID,
                            name: response.data.Name,
                            date: new Date(response.data.CreationDate),
                            list: []
                        });
                    }
                    else {
                        console.log(response);
                    }

                    return response;
                }, function (errResponse) {
                    console.log(errResponse);

                    return response;
                });
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        deletePlaylist: function (playlistId) {
            var $this = this;
            if (self.user.isLogged && this.playlistExistsId(playlistId)) {
                return $http.post($rootScope.baseUrl + 'src/php/playlist.delete.php', {
                    playlist: playlistId,
                    user: self.userSecure.userId
                }).then(function (response) {
                    if (typeof response.data.PlaylistID !== "undefined") {
                        self.savedPlaylistsArray.splice($this.getIndexId(playlistId), 1);
                    }
                    else {
                        console.log(response);
                    }

                    return response;
                }, function (errResponse) {
                    console.log(errResponse);

                    return response;
                });
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        renamePlaylist: function (playlistId, newName) {
            var $this = this;
            if (self.user.isLogged && this.playlistExistsId(playlistId) && !this.playlistExistsName(newName)) {
                return $http.post($rootScope.baseUrl + 'src/php/playlist.rename.php', {
                    playlist: playlistId,
                    newName: newName,
                    user: self.userSecure.userId
                }).then(function (response) {
                    if (typeof response.data.PlaylistID !== "undefined") {
                        self.savedPlaylistsArray[$this.getIndexId(playlistId)].name = newName;
                    }
                    else {
                        console.log(response);
                    }

                    return response;
                }, function (errResponse) {
                    console.log(errResponse);

                    return response;
                });
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        getPlaylist: function (playlistId) {
            if (self.user.isLogged && this.playlistExistsId(playlistId)) {
                return self.savedPlaylistsArray[this.getIndexId(playlistId)];
            } else {
                return {};
            }
        },
        getAllPlaylists: function () {
            if (self.user.isLogged && self.savedPlaylistsArray.length > 0) {
                return self.savedPlaylistsArray;
            } else {
                return [];
            }
        },
        addTrack: function (playlistId, trackData) {
            var $this = this;
            if (self.user.isLogged && this.playlistExistsId(playlistId) && typeof trackData !== "undefined") {
                return $http.post($rootScope.baseUrl + 'src/php/track.add.php', {
                    title: trackData.title,
                    video: trackData.videoId,
                    img: trackData.img,
                    playlist: playlistId,
                    user: self.userSecure.userId
                }).then(function (response) {
                    if (typeof response.data.PlaylistID !== "undefined") {
                        self.savedPlaylistsArray[$this.getIndexId(playlistId)].list.push({
                            trackId: response.data.TrackID,
                            title: response.data.Title,
                            videoId: response.data.Video,
                            img: response.data.Image,
                            date: new Date(response.data.AdditionDate),
                            position: response.data.Position
                        });
                    }
                    else {
                        console.log(response);
                    }

                    return response;
                }, function (errResponse) {
                    console.log(errResponse);

                    return response;
                });
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        removeTrack: function (playlistId, trackId) {
            var $this = this;
            if (self.user.isLogged && this.playlistExistsId(playlistId) && trackId > 0) {
                return $http.post($rootScope.baseUrl + 'src/php/track.remove.php', {
                    track: trackId,
                    playlist: playlistId,
                    user: self.userSecure.userId
                }).then(function (response) {
                    if (typeof response.data.PlaylistID !== "undefined") {
                        var plIndex = $this.getIndexId(playlistId),
                            tkIndex = self.savedPlaylistsArray[plIndex].list.findIndex(function(e) { return e.trackId == trackId });
                        self.savedPlaylistsArray[plIndex].list.splice(tkIndex, 1);
                    }
                    else {
                        console.log(response);
                    }

                    return response;
                }, function (errResponse) {
                    console.log(errResponse);

                    return response;
                });
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        changeTrackPosition: function (playlistId, trackId, direction) {
            var $this = this;
            if (self.user.isLogged && this.playlistExistsId(playlistId) && trackId > 0 && (direction == 'up' || direction == 'down')) {
                return $http.post($rootScope.baseUrl + 'src/php/track.position.php', {
                    track: trackId,
                    playlist: playlistId,
                    direction: direction,
                    user: self.userSecure.userId
                }).then(function (response) {
                    if (typeof response.data.Position !== "undefined") {
                        var plIndex = $this.getIndexId(playlistId),
                            tkIndex = self.savedPlaylistsArray[plIndex].list.findIndex(function(e) { return e.trackId == response.data.TrackID });

                        if (direction == 'up') {
                            var nextIndex = self.savedPlaylistsArray[plIndex].list.findIndex(function (e) { return e.position == parseInt(response.data.Position) - 1 });                            
                            self.savedPlaylistsArray[plIndex].list[nextIndex].position = response.data.Position;

                            self.savedPlaylistsArray[plIndex].list[tkIndex].position = (parseInt(response.data.Position) - 1).toString();
                        }
                        else {
                            var prevIndex = self.savedPlaylistsArray[plIndex].list.findIndex(function (e) { return e.position == parseInt(response.data.Position) + 1 });
                            self.savedPlaylistsArray[plIndex].list[prevIndex].position = response.data.Position;

                            self.savedPlaylistsArray[plIndex].list[tkIndex].position = (parseInt(response.data.Position) + 1).toString();
                        }

                        self.savedPlaylistsArray[plIndex].list.sort(function (a,b) { return parseInt(a.position) - parseInt(b.position)});
                    }
                    else {
                        console.log(response);
                    }

                    return response;
                }, function (errResponse) {
                    console.log(errResponse);

                    return response;
                });
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        appendPlaylist: function (playlistId, sourcePlaylist) {
            var $this = this;
            if (self.user.isLogged && this.playlistExistsId(playlistId) && typeof sourcePlaylist !== "undefined" && sourcePlaylist.length > 0) {
                var waitForLast = {};
                waitForLast.promise = new Promise(function (resolve, reject) {
                    waitForLast.resolve = resolve;
                    waitForLast.reject = reject;
                });

                var i = -1;
                trackRequest(playlistId, sourcePlaylist);

                function trackRequest(id, source) {                    
                    i++;

                    if (i < source.length - 1) {
                        $this.addTrack(id, source[i]).then(function (response) {
                            trackRequest(id, source);
                        }, function (errResponse) {
                            console.log(errResponse);
                            trackRequest(id, source);
                        });
                    }
                    else if (i == source.length - 1) { // last
                        $this.addTrack(id, source[i]).then(function (response) {
                            waitForLast.resolve(response);
                        }, function (errResponse) {
                            console.log(errResponse);
                            waitForLast.reject(errResponse);
                        });
                    }
                }

                return waitForLast.promise;
            }
            else {
                return new Promise(
                    function (resolve, reject) {
                        resolve({
                            data: null
                        });
                    }
                );
            }
        },
        // Helpers
        getIndexName: function (name) {
            var index = self.savedPlaylistsArray.findIndex(function(e) { return e.name == name });
            if (index >= 0) {
                return index;
            }
            return false;
        },
        getIndexId: function (playlistId) {
            var index = self.savedPlaylistsArray.findIndex(function(e) { return e.playlistId == playlistId });
            if (index >= 0) {
                return index;
            }
            return false;
        },
        playlistExistsName: function (name) {
            if (self.savedPlaylistsArray.filter(function (e) {
                    return e.name == name;
                }).length > 0) {
                return true;
            }
            return false;
        },
        playlistExistsId: function (playlistId) {
            if (self.savedPlaylistsArray.filter(function (e) {
                    return e.playlistId == playlistId;
                }).length > 0) {
                return true;
            }
            return false;
        }
    };
});