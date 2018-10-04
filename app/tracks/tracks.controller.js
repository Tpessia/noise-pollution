app.controller("TracksController", function ($rootScope, $scope, $location, $q, tracksService, topsService) {
    var dft = {
        page: 1,
        limit: 5
    };

    // Content control

    getTopTracks(1, 5);
    function getTopTracks(page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        topsService.getTopTracks(page, limit).then(function (response) {
            if (typeof response.data.error === "undefined") {
                $scope.tracks = response.data.tracks.track.slice(-limit);

                for (var i in $scope.tracks) {
                    (function (j) {
                        tracksService.getTrackInfo($scope.tracks[j].artist.name, $scope.tracks[j].name).then(function (response) {
                            if (typeof response.data.error === "undefined") {
                                if (typeof response.data.track !== "undefined") {
                                    $scope.tracks[j].info = response.data.track;
                                    if (typeof response.data.track.album !== "undefined" && response.data.track.album.image[0]["#text"] != "") {
                                        $scope.tracks[j].image = response.data.track.album.image;
                                    }
                                }
                            } else {
                                console.log(response);
                            }
                        }, function (errResponse) {
                            console.log(errResponse)
                        }).finally(function () {
                            if ($scope.tracks.length > 0 && $scope.tracks[j].image !== "undefined" && $scope.tracks[j].image[0]["#text"] == "") {
                                $scope.tracks[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                            }

                            $scope.tracks[j].imgsDone = true;
                        });
                    })(i)
                }
            }
            else {
                console.log(response);
            }
        }, function (errResponse) {
            console.log(errResponse);
        });
    };

    $scope.getTrackSearch = function (track, page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        if (typeof $scope.trackSearchAbort !== "undefined") { // prepare abort option
            $scope.trackSearchAbort.resolve();
        }
        $scope.trackSearchAbort = $q.defer();

        tracksService.getTrackSearch(track, page, limit, $scope.trackSearchAbort.promise).then(function (response) {
            if (typeof response.data.error === "undefined") {
                $scope.searchedTracks = response.data.results.trackmatches.track.slice(-limit);

                for (var i in $scope.searchedTracks) {
                    (function (j) {
                        tracksService.getTrackInfo($scope.searchedTracks[j].artist, $scope.searchedTracks[j].name, $scope.trackSearchAbort.promise).then(function (response) {
                            if (typeof response.data.error === "undefined") {
                                if (typeof response.data.track !== "undefined") {
                                    $scope.searchedTracks[j].info = response.data.track;
                                    if (typeof response.data.track.album !== "undefined" && response.data.track.album.image[0]["#text"] != "") {
                                        $scope.searchedTracks[j].image = response.data.track.album.image;
                                    }
                                }
                            } else {
                                console.log(response);
                            }
                        }, function (errResponse) {                            
                            if (errResponse.xhrStatus != "abort") {
                                console.log(errResponse);
                            }
                        }).finally(function () {
                            if ($scope.searchedTracks.length > 0 && $scope.searchedTracks[j].image !== "undefined" && $scope.searchedTracks[j].image[0]["#text"] == "") {
                                $scope.searchedTracks[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                            }

                            $scope.searchedTracks[j].imgsDone = true;
                        });
                    })(i)
                }
            }
            else {
                console.log(response);
            }
        }, function (errResponse) {
            if (errResponse.xhrStatus != "abort") {
                console.log(errResponse);
            }
        });
    };

    // Events

    $scope.onSearch = function (searchKey) {
        if (validate(searchKey)) {
            $location.search('search', searchKey); // url search param set
            $scope.searchKey = searchKey;
            $scope.isSearch = true;
            $scope.getTrackSearch(searchKey, dft.page, dft.limit);
            return true;
        }

        return false;

        function validate(key) {
            if (typeof key !== "undefined" && key != '') {
                return true;
            }
            else {
                return false;
            }
        }
    }

    $scope.onClose = function () {
        $scope.isSearch = false;
    }

    $scope.onPageChange = function (page) {
        $scope.getTrackSearch($scope.searchKey, page, dft.limit);
    }

    // User options

    $scope.saveOnPlaylist = function (playlistId, videoData) {
        $rootScope.$broadcast('userSaveTrack', {
            'playlistId': playlistId,
            'videoData': videoData
        });
    }

    // Youtube caller

    $scope.ytVideo = {
        open: function (videoData) {
            $rootScope.$broadcast('ytPlayVideo', videoData);
            // { type: 'video', artist: 'Portugal. The Man', track: 'Noise Pollution' }
        }
    }

    // Helpers

    $scope.formatDuration = function(time) {
        var minutes = Math.floor((time / 60) / 1000);
        var seconds = Math.round(((time / 60) / 1000 - Math.floor((time / 60) / 1000)) * 60);

        seconds = seconds < 10 ? seconds + "0" : seconds;

        return minutes + ":" + seconds;
    }

    $scope.stripLink = function (text) {
        return text.replace(/<a(.|\n)*?<\/a>.?/, '').trim();
    }

    $scope.getSummaryLink = function (text) {
        return text.match(/<a(.|\n)*?<\/a>/)[0].match(/href="(.|\n)*?"/)[0].replace('href="', '').replace('"', '');
    }

    // Search on click

    $scope.searchFor = function (type, value) {
        var encodedValue = encodeURIComponent(value);

        switch (type) {
            case 'track':
                return $rootScope.baseUrl + '#!/tracks?search=' + encodedValue;
                break;
            case 'artist':
                return $rootScope.baseUrl + '#!/artists?search=' + encodedValue;
                break;
            case 'album':
                return $rootScope.baseUrl + '#!/albums?search=' + encodedValue;
                break;
            default:
                throw 'Invalid video type "' + type + '"';
                break;
        }
    };

    // Scroll back to top

    $scope.backToTop = function () {
        scrollTo($$('#search-results')[0].offsetTop - $$('nav')[0].offsetHeight, 600);
    };
});