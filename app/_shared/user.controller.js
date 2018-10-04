app.controller("UserController", function ($rootScope, $scope, $timeout, $route, userService, youTubeService) {

    $scope.user = userService.user;

    $scope.userMethods = {};

    // Login

    $scope.userMethods.signUp = function (data) {
        return userService.signUp(data).then(function (response) {
            if (typeof response.data.UserID !== "undefined") {
                logUser(response.data);
            }
            
            return response;
        }, function (errResponse) {
            console.log(errResponse);
            
            return errResponse;
        });
    };

    $scope.userMethods.signIn = function (data) {
        return userService.signIn(data).then(function (response) {
            var signInResponse = response;
            if (typeof response.data.UserID !== "undefined") {
                logUser(response.data);

                return userService.savedPlaylists.loadPlaylists().then(function (response) {
                    return signInResponse;
                }, function (errResponse) {
                    console.log(errResponse);

                    return errResponse;
                });
            }
            else {
                return response;
            }
        }, function (errResponse) {
            console.log(errResponse);
            
            return errResponse;
        });
    };

    $scope.userMethods.logOut = function () {
        userService.logOut().then(function (response) {
            userService.user.isLogged = false;
            userService.user.avatar = null;
            userService.user.name = null;
            userService.user.email = null;

            userService.userSecure.username = null;
            userService.userSecure.userId = null;

            $timeout(function () {
                $rootScope.materialize.all();
            }, 10);

            M.toast({
                html: 'Logged Out',
                displayLength: '2000'
            });

            $route.reload();
        }, function (errResponse) {
            M.toast({
                html: 'Error on logout',
                classes: 'red darken-4',
                displayLength: '2000'
            });

            console.log(errResponse);
        });
    };

    function logUser(data) {
        userService.user.isLogged = true;
        userService.user.avatar = $rootScope.baseUrl + data.Avatar;
        userService.user.name = data.Name;
        userService.user.email = data.Email;

        userService.userSecure.username = data.Username;
        userService.userSecure.userId = data.UserID;

        $timeout(function () {
            $rootScope.materialize.all();
        }, 10);

        $route.reload();
    }

    // Login from session

    sessionLogin();
    function sessionLogin() {
        $scope.sessionLoginResponse = userService.sessionLogin().then(function (response) {
            if (typeof response.data.UserID !== "undefined") {
                logUser(response.data);

                return userService.savedPlaylists.loadPlaylists();
            }
            else {
                return response;
            }
        }, function (errResponse) {
            console.log(errResponse);

            return errResponse;
        });
    }

    // Events

    $scope.$on('userSaveTrack', function (event, data) {
        // { type: 'track', artist: 'Portugal. The Man', track: 'Noise Pollution' }
        switch (data.videoData.type) {
            case 'track':
                getTrackId(data.playlistId, data.videoData.artist, data.videoData.track);
                break;
            case 'album':
                getAlbumTrackIds(data.playlistId, data.videoData.artist, data.videoData.album);
                break;
            case 'artist':
                getArtistTrackIds(data.playlistId, data.videoData.artist);
                break;
            default:
                throw 'Invalid video type "' + data.videoData.type + '"';
                break;
        }
    });

    // Video ID getters

    function getTrackId(playlistId, artist, track) {
        youTubeService.getMusicVideo(artist, track).then(function (response) {
            if (typeof response.data.error === "undefined" && typeof response.data.error === "undefined") {
                var video = response.data.items[0],
                    videoId = video.id.videoId,
                    title = video.snippet.title;
                    
                userService.savedPlaylists.addTrack(playlistId, {
                    'videoId': videoId,
                    'title': title,
                    'img': video.snippet.thumbnails.medium.url
                }).then(function (response) {
                    if (typeof response.data.TrackID !== "undefined") {
                        M.toast({
                            html: 'Track added',
                            displayLength: '2000'
                        });
                    }
                    else {
                        M.toast({
                            html: 'Error on track addition',
                            classes: 'red darken-4',
                            displayLength: '2000'
                        });

                        console.log(response);
                    }
                }, function (errResponse) {
                    M.toast({
                        html: 'Error on track addition',
                        classes: 'red darken-4',
                        displayLength: '2000'
                    });

                    console.log(errResponse);
                });
            }
            else {
                console.log(response);
            }
        }, function (errResponse) {
            console.log(errResponse)
        });
    }

    function getAlbumTrackIds(playlistId, artist, album) {
        youTubeService.getAlbumPlaylist(artist, album).then(function (response) {
            if (typeof response.data.error === "undefined" && typeof response.data.error === "undefined") {
                var playlist = response.data.items[0],
                    id = playlist.id.playlistId, // Playlist's ID
                    videosData = [];

                    getVideosIds(id, null);
                    function getVideosIds(id, pageToken) {
                        youTubeService.getPlaylistVideos(id, pageToken).then(function (response) {
                            if (typeof response.data.error === "undefined" && typeof response.data.error === "undefined") {
                                var videos = response.data.items;

                                for (var i in videos) {
                                    videosData.push({
                                        'videoId': videos[i].contentDetails.videoId,
                                        'title': videos[i].snippet.title,
                                        'img': videos[i].snippet.thumbnails.medium.url
                                    });
                                }
                                
                                if (typeof response.data.nextPageToken !== "undefined") { // tem mais páginas?
                                    getVideosIds(id, response.data.nextPageToken);
                                }
                                else { // se não, adiciona todos os dados
                                    window.onbeforeunload = function () { return 'Adding track...'; };
                                    var addingToast = M.toast({
                                        html: 'Adding tracks...',
                                        displayLength: '999999',
                                        completeCallback: function () {
                                            window.onbeforeunload = function () { return null; };
                                        }
                                    });
                                    userService.savedPlaylists.appendPlaylist(playlistId, videosData).then(function (response) {
                                        addingToast.dismiss();

                                        if (typeof response.data.TrackID !== "undefined") {
                                            M.toast({
                                                html: 'Tracks added',
                                                displayLength: '2000'
                                            });
                                        }
                                        else {
                                            M.toast({
                                                html: 'Error on tracks addition',
                                                classes: 'red darken-4',
                                                displayLength: '2000'
                                            });

                                            console.log(response);
                                        }
                                    }, function (errResponse) {
                                        addingToast.dismiss();

                                        M.toast({
                                            html: 'Error on tracks addition',
                                            classes: 'red darken-4',
                                            displayLength: '2000'
                                        });

                                        console.log(errResponse);
                                    });
                                }
                            } else {
                                console.log(response);
                            }
                        }, function (errResponse) {
                            console.log(errResponse);
                        });
                    }
            }
            else {
                console.log(response);
            }
        }, function (errResponse) {
            console.log(errResponse)
        });
    }

    function getArtistTrackIds(playlistId, artist) {
        youTubeService.getArtistPlaylist(artist).then(function (response) {
            if (typeof response.data.error === "undefined" && typeof response.data.error === "undefined") {
                var playlist = response.data.items[0],
                    id = playlist.id.playlistId, // Playlist's ID
                    videosData = [];

                    getVideosIds(id, null);
                    function getVideosIds(id, pageToken) {
                        youTubeService.getPlaylistVideos(id, pageToken).then(function (response) {
                            if (typeof response.data.error === "undefined" && typeof response.data.error === "undefined") {
                                var videos = response.data.items;
                                for (var i in videos) {
                                    videosData.push({
                                        'videoId': videos[i].contentDetails.videoId,
                                        'title': videos[i].snippet.title,
                                        'img': videos[i].snippet.thumbnails.medium.url
                                    });
                                }

                                if (typeof response.data.nextPageToken !== "undefined") { // tem mais páginas?
                                    getVideosIds(id, response.data.nextPageToken);
                                }
                                else { // se não, adiciona todos os dados
                                    userService.savedPlaylists.appendPlaylist(playlistId, videosData).then(function (response) {
                                        if (typeof response.data.TrackID !== "undefined") {
                                            M.toast({
                                                html: 'Tracks added',
                                                displayLength: '2000'
                                            });
                                        }
                                        else {
                                            M.toast({
                                                html: 'Error on tracks addition',
                                                classes: 'red darken-4',
                                                displayLength: '2000'
                                            });

                                            console.log(response);
                                        }
                                    }, function (errResponse) {
                                        M.toast({
                                            html: 'Error on tracks addition',
                                            classes: 'red darken-4',
                                            displayLength: '2000'
                                        });

                                        console.log(errResponse);
                                    });
                                }
                            } else {
                                console.log(response);
                            }
                        }, function (errResponse) {
                            console.log(errResponse);
                        });
                    }
            }
            else {
                console.log(response);
            }
        }, function (errResponse) {
            console.log(errResponse)
        });
    }
});