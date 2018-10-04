app.controller("UserPlaylistsController", function ($rootScope, $scope, $route, $timeout, $location, userService) {
    $scope.state = {
        renamingPlaylist: false,
        tempName: ''
    };

    // Check session

    redirectNotLogged();
    function redirectNotLogged() {
        $scope.$parent.sessionLoginResponse.then(function (response) {
            if (!userService.user.isLogged) {
                // Redirect

                $location.search("pl", null);
                $location.path("/");
            }
            else {
                $scope.playlists = userService.savedPlaylists.getAllPlaylists().sort(function(a,b){return new Date(b.date) - new Date(a.date);});

                // Set initial playlist

                setInitialPlaylist();
                function setInitialPlaylist() {
                    var pl = 0; // default playlist

                    if (typeof $location.search().pl !== "undefined") {
                        var tempPl = $location.search().pl;
                        if (typeof $scope.playlists[tempPl] !== 'undefined') {
                            pl = parseInt(tempPl);
                        }
                    }
                    
                    if (typeof $scope.playlists[pl] !== "undefined") {
                        $scope.activePlaylist = {
                            'playlistId': $scope.playlists[pl].playlistId,
                            'name': $scope.playlists[pl].name,
                            'list': $scope.playlists[pl].list,
                            'index': pl
                        };
                    }
                }
            }
        }, function (errResponse) {
            console.log(errResponse);
        });
    }

    // Actions & Events

    $scope.selectPlaylist = function (playlistId) {
        var playlist = userService.savedPlaylists.getPlaylist(playlistId),
            index = userService.savedPlaylists.getIndexId(playlistId);
        $scope.activePlaylist = {
            'playlistId': playlist.playlistId,
            'name': playlist.name,
            'list': playlist.list,
            'index': index
        };
        
        if (typeof index === 'number' && (index % 1) === 0 && index >= 0) {
            $location.search('pl', index);
        }
        else {
            $location.search('pl', null);
        }
    };

    $scope.deletePlaylist = function (playlistId) {
        if (window.confirm("This action is irreversible. Do you want to proceed?")) {
            userService.savedPlaylists.deletePlaylist(playlistId).then(function (response) {
                if (typeof response.data.PlaylistID !== "undefined") {
                    M.toast({
                        html: 'Playlist deleted',
                        displayLength: '2000'
                    });

                    var index = userService.savedPlaylists.getIndexId(playlistId),
                        prev = index == 0 ? userService.savedPlaylists.getAllPlaylists().length - 1 : index - 1;

                    $location.search('pl', prev);
                    $route.reload();
                }
                else {
                    M.toast({
                        html: 'Error on playlist deletion',
                        classes: 'red darken-4',
                        displayLength: '2000'
                    });

                    console.log(response);
                }
            }, function (errResponse) {
                M.toast({
                    html: 'Error on playlist deletion',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });

                console.log(errResponse);
            });
        }
    };

    $scope.renamePlaylist = function (playlistId, newName) {
        $scope.state.renamingPlaylist = false;

        newName = $scope.state.tempName; // Error, fix this

        userService.savedPlaylists.renamePlaylist(playlistId, newName).then(function (response) {
            if (typeof response.data.PlaylistID !== "undefined") {
                M.toast({
                    html: 'Playlist renamed',
                    displayLength: '2000'
                });

                $route.reload();
            }
            else {
                M.toast({
                    html: 'Error on playlist creation',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });

                console.log(response);
            }
        }, function (errResponse) {
            M.toast({
                html: 'Error on playlist creation',
                classes: 'red darken-4',
                displayLength: '2000'
            });

            console.log(errResponse);
        });
    };

    $scope.removeTrack = function (playlistId, trackId) {
        userService.savedPlaylists.removeTrack(playlistId, trackId).then(function (response) {
            if (typeof response.data.TrackID !== "undefined") {
                // M.toast({
                //     html: 'Track removed',
                //     displayLength: '2000'
                // });
            }
            else {
                M.toast({
                    html: 'Error on track removal',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });

                console.log(response);
            }
        }, function (errResponse) {
            M.toast({
                html: 'Error on track removal',
                classes: 'red darken-4',
                displayLength: '2000'
            });

            console.log(errResponse);
        });
    };

    $scope.changeTrackPosition = function (playlistId, trackId, direction) {
        userService.savedPlaylists.changeTrackPosition(playlistId, trackId, direction).then(function (response) {
            if (typeof response.data.TrackID !== "undefined") {
                // M.toast({
                //     html: 'Position altered',
                //     displayLength: '2000'
                // });
            }
            else {
                M.toast({
                    html: 'Error on position alteration',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });

                console.log(response);
            }
        }, function (errResponse) {
            M.toast({
                html: 'Error on position alteration',
                classes: 'red darken-4',
                displayLength: '2000'
            });

            console.log(errResponse);
        });
    };

    $scope.ytVideo = {
        open: function (videoData) {
            $rootScope.$broadcast('ytPlayVideo', videoData);
            // { type: 'id', id: '123456' }
        },
        playCustomPlaylist: function (playlistId) {
            if ($scope.activePlaylist.list.length > 0) {
                $rootScope.$broadcast('ytPlayCustomPlaylist', userService.savedPlaylists.getPlaylist(playlistId).list);
            }
        }
    };

    $scope.showInput = function () {
        $scope.state.renamingPlaylist = true;
        setTimeout(function () {
            $$('.playlist-name input')[0].focus();
        }, 100);
    };

    $scope.onBlur = function () {
        $timeout(function () {
            $scope.state.renamingPlaylist = false;
        }, 1000);
    };

    // Easter egg

    $scope.$watch('state.tempName', function (newVal, oldVal) {
        if (oldVal !== newVal && newVal == "314159") {
            $scope.easterEgg = true;
        }
    });

    $scope.downloadPlaylist = function (playlistId) {
        var playlist = userService.savedPlaylists.getPlaylist(playlistId);
        
        for (var i in playlist.list) {
            var track = playlist.list[i];
            
            window.open('https://www.yout.com/video/' + track.videoId, '_blank');
        }
    };

    $scope.downloadTrack = function (videoId) {
        window.open('https://www.yout.com/video/' + videoId, '_blank');
    };
});