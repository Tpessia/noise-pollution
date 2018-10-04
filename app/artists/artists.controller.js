app.controller("ArtistsController", function ($rootScope, $scope, $location, $q, artistsService, topsService) {
    var dft = {
        page: 1,
        limit: 5
    };

    // Content control

    getTopArtists(1, 5);
    function getTopArtists(page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        topsService.getTopArtists(page, limit).then(function (response) {
            if (typeof response.data.error === "undefined") {
                $scope.artists = response.data.artists.artist.slice(-limit);

                for (var i in $scope.artists) {
                    (function (j) {
                        artistsService.getArtistInfo($scope.artists[j].name).then(function (response) {
                            if (typeof response.data.error === "undefined") {
                                if (typeof response.data.artist !== "undefined") {
                                    $scope.artists[j].info = response.data.artist;
                                    if (typeof response.data.artist.image !== "undefined" && response.data.artist.image[0]["#text"] != "") {
                                        $scope.artists[j].image = response.data.artist.image;
                                    }
                                }
                            } else {
                                console.log(response);
                            }
                        }, function (errResponse) {
                            console.log(errResponse);
                        }).finally(function () {
                            if ($scope.artists.length > 0 && $scope.artists[j].image !== "undefined" && $scope.artists[j].image[0]["#text"] == "") {
                                $scope.artists[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                            }

                            $scope.artists[j].imgsDone = true;
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

    $scope.getArtistSearch = function (artist, page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        if (typeof $scope.artistSearchAbort !== "undefined") { // prepare abort option
            $scope.artistSearchAbort.resolve();
        }
        $scope.artistSearchAbort = $q.defer();

        artistsService.getArtistSearch(artist, page, limit, $scope.artistSearchAbort.promise).then(function (response) {
            if (typeof response.data.error === "undefined") {
                $scope.searchedArtists = response.data.results.artistmatches.artist.slice(-limit);

                for (var i in $scope.searchedArtists) {
                    (function (j) {
                        artistsService.getArtistInfo($scope.searchedArtists[j].name, $scope.artistSearchAbort.promise).then(function (response) {
                            if (typeof response.data.error === "undefined") {
                                if (typeof response.data.artist !== "undefined") {
                                    $scope.searchedArtists[j].info = response.data.artist;
                                    if (typeof response.data.artist.image !== "undefined" && response.data.artist.image[0]["#text"] != "") {
                                        $scope.searchedArtists[j].image = response.data.artist.image;
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
                            if ($scope.searchedArtists.length > 0 && $scope.searchedArtists[j].image !== "undefined" && $scope.searchedArtists[j].image[0]["#text"] == "") {
                                $scope.searchedArtists[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                            }

                            $scope.searchedArtists[j].imgsDone = true;
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
            $scope.getArtistSearch(searchKey, dft.page, dft.limit);
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
        $scope.getArtistSearch($scope.searchKey, page, dft.limit);
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
            // { type: 'artist', artist: 'Portugal. The Man' }
        }
    }

    // Helpers

    $scope.stripLink = function (text) {
        return text.replace(/<a(.|\n)*?<\/a>.?/, '').trim();
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