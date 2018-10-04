app.controller("AlbumsController", function ($rootScope, $scope, $location, $q, albumsService, topsService, artistsService) {
    var dft = {
        page: 1,
        limit: 5
    };

    // Content control

    getTopAlbums(1, 5);
    function getTopAlbums(page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        topsService.getTopArtists(page, limit).then(function (response) {
            if (typeof response.data.error === "undefined") {
                $scope.albums = [];
                var topArtists = response.data.artists.artist;

                for (var i in topArtists) {
                    (function (j) {
                        var artist = topArtists[j].name,
                            rndPage = 1;// + Math.floor(Math.random() * 2);

                        artistsService.getTopAlbums(artist, rndPage, 1).then(function (response) { // get random album
                            if (typeof response.data.error === "undefined") {
                                var rndAlbum = response.data.topalbums.album.pop();

                                if (typeof rndAlbum !== "undefined") {
                                    $scope.albums[j] = rndAlbum;

                                    albumsService.getAlbumInfo(rndAlbum.artist.name, rndAlbum.name).then(function (response) {
                                        if (typeof response.data.error === "undefined") {
                                            if (typeof response.data.album !== "undefined") {
                                                $scope.albums[j].info = response.data.album;
                                                if (typeof response.data.album.image !== "undefined" && response.data.album.image[0]["#text"] != "") {
                                                    $scope.albums[j].image = response.data.album.image;
                                                }
                                            }
                                        }
                                        else {
                                            console.log(response);
                                        }
                                    }, function (errResponse) {
                                        console.log(errResponse);
                                    }).finally(function () {
                                        if ($scope.albums.length > 0 && $scope.albums[j].image !== "undefined" && $scope.albums[j].image[0]["#text"] == "") {
                                            $scope.albums[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                                        }

                                        $scope.albums[j].imgsDone = true;
                                    });
                                }
                            } else {
                                console.log(response);
                            }
                        }, function (errResponse) {
                            console.log(errResponse)
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

    $scope.getAlbumSearch = function (album, page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        if (typeof $scope.albumSearchAbort !== "undefined") { // prepare abort option
            $scope.albumSearchAbort.resolve();
        }
        $scope.albumSearchAbort = $q.defer();

        albumsService.getAlbumSearch(album, page, limit, $scope.albumSearchAbort.promise).then(function (response) {
            if (typeof response.data.error === "undefined") {
                $scope.searchedAlbums = response.data.results.albummatches.album.slice(-limit);

                for (var i in $scope.searchedAlbums) {
                    (function (j) {
                        albumsService.getAlbumInfo($scope.searchedAlbums[j].artist, $scope.searchedAlbums[j].name, $scope.albumSearchAbort.promise).then(function (response) {
                            if (typeof response.data.error === "undefined") {
                                if (typeof response.data.album !== "undefined") {
                                    $scope.searchedAlbums[j].info = response.data.album;
                                    if (typeof response.data.album.image !== "undefined" && response.data.album.image[0]["#text"] != "") {
                                        $scope.searchedAlbums[j].image = response.data.album.image;
                                    }
                                }
                            } else {
                                console.log(response.data);
                            }
                        }, function (errResponse) {                                
                            if (errResponse.xhrStatus != "abort") {
                                console.log(errResponse);
                            }
                        }).finally(function () {
                            if ($scope.searchedAlbums.length > 0 && $scope.searchedAlbums[j].image !== "undefined" && $scope.searchedAlbums[j].image[0]["#text"] == "") {
                                $scope.searchedAlbums[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                            }

                            $scope.searchedAlbums[j].imgsDone = true;
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
            $scope.getAlbumSearch(searchKey, dft.page, dft.limit);
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
        $scope.getAlbumSearch($scope.searchKey, page, dft.limit);
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
            // { type: 'playlist', artist: 'Portugal. The Man', album: 'Woodstock' }
        }
    }

    // Helpers

    $scope.getArtistUrlFromString = function (strUrl) {
        var pathToArtist = "https://www.last.fm/music/";
        var artist = strUrl.split(pathToArtist)[1].split("/")[0];
        return pathToArtist + artist;
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