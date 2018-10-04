app.controller("SearchController", function ($scope, $location, $q, tracksService, artistsService, albumsService) {
    $scope.searchAvailable = true;

    $scope.onSubmit = function(key) {
        var searchSuccess = $scope.onSearch({ searchKey: key });
        if (searchSuccess) {
            $scope.searchAvailable = false;
            $$("[search-wide] input")[0].blur();
        }
        else {
            M.toast({
                html: 'Invalid search',
                classes: 'red darken-4',
                displayLength: '2000'
            });
        }
    }

    $scope.close = function() {
        $location.search('search', null);
        $scope.searchAvailable = true;
        angular.element($$(".search-wide input")).val('');
        $scope.onClose();
    }

    $scope.$watch('key', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal != "") {
            // Unlock search

            $scope.searchAvailable = true;

            // Autocomplete

            if (typeof $scope.autocompleteAbort !== "undefined") { // prepare abort option
                $scope.autocompleteAbort.resolve();
            }
            $scope.autocompleteAbort = $q.defer();

            var instance = M.Autocomplete.getInstance($scope.instances.autocomplete[0].el),
                limit = instance.options.limit;
                
            switch ($scope.searchType) {
                case 'Tracks':
                    tracksService.getTrackSearch(newVal, 1, limit, $scope.autocompleteAbort.promise).then(function (response) {
                        if (typeof response.data.error === "undefined" && typeof response.data.results !== "undefined") {
                            var tracks = response.data.results.trackmatches.track,
                                autoTracks = {};

                            for (var i in tracks) {
                                var name = tracks[i].name;

                                autoTracks[name] = null;
                            }

                            instance.updateData(autoTracks);
                            instance.open();
                        }
                        else {
                            console.log(response);
                        }
                    }, function (errResponse) {
                        if (errResponse.xhrStatus != "abort") {
                            console.log(errResponse);
                        }
                    });
                    break;
                case 'Artists':
                    artistsService.getArtistSearch(newVal, 1, limit, $scope.autocompleteAbort.promise).then(function (response) {
                        if (typeof response.data.error === "undefined" && typeof response.data.results !== "undefined") {
                            var artists = response.data.results.artistmatches.artist,
                                autoArtists = {};

                            for (var i in artists) {
                                var name = artists[i].name;

                                autoArtists[name] = null;
                            }

                            instance.updateData(autoArtists);
                            instance.open();
                        }
                        else {
                            console.log(response);
                        }
                    }, function (errResponse) {
                        if (errResponse.xhrStatus != "abort") {
                            console.log(errResponse);
                        }
                    });
                    break;
                case 'Albums':
                    albumsService.getAlbumSearch(newVal, 1, limit, $scope.autocompleteAbort.promise).then(function (response) {
                        if (typeof response.data.error === "undefined" && typeof response.data.results !== "undefined") {
                            var albums = response.data.results.albummatches.album,
                                autoAlbums = {};

                            for (var i in albums) {
                                var name = albums[i].name;

                                autoAlbums[name] = null;
                            }

                            instance.updateData(autoAlbums);
                            instance.open();
                        }
                        else {
                            console.log(response);
                        }
                    }, function (errResponse) {
                        if (errResponse.xhrStatus != "abort") {
                            console.log(errResponse);
                        }
                    });
                    break;
                default:
                    throw 'Invalid search type';
            }
        }
    });

    searchParamControl();
    function searchParamControl() {
        if (typeof $location.search().search !== "undefined") {
            var searchParam = $location.search().search;

            $scope.key = searchParam;
            $scope.onSubmit(searchParam);
        }
    }
});