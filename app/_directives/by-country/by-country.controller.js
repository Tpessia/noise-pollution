app.controller("ByCountryController", function ($rootScope, $scope, $q, geoService, tracksService, artistsService) {
    var dft = {
        page: 1,
        limit: 5
    };

    $scope.countries = geoService.countries;

    // Search Object

    createSearchObj();
    function createSearchObj() {
        var countriesArr = [],
            j = 0;

        for (var i in $scope.countries) {
            countriesArr[j] = {
                name: i
            };

            j++;
        }

        $scope.countriesSearch = new Fuse(countriesArr, {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["name"]
        });
    }

    // Get Tracks and Artists

    $scope.getTracksByCountry = function (country, page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        var progressBar = $$('.country .progress');
        angular.element(progressBar).removeClass('hide');

        var countryCode = $scope.countries[country];

        if (typeof $scope.tracksCountryAbort !== "undefined") { // prepare abort option
            $scope.tracksCountryAbort.resolve();
        }
        $scope.tracksCountryAbort = $q.defer();

        geoService.getTracksByCountry(countryCode, page, limit, $scope.tracksCountryAbort.promise).then(function (response) {
            angular.element(progressBar).removeClass('artists-complete').addClass('hide');

            if (typeof response.data.error === "undefined") {
                $scope.crountryTracks = response.data.tracks.track.slice(-limit);

                for (var i in $scope.crountryTracks) {
                    (function (j) {
                        tracksService.getTrackInfo($scope.crountryTracks[j].artist.name, $scope.crountryTracks[j].name, $scope.tracksCountryAbort.promise).then(function (response) {
                            if (typeof response.data.error === "undefined") {
                                if (typeof response.data.track !== "undefined") {
                                    $scope.crountryTracks[j].info = response.data.track;
                                    if (typeof response.data.track.album !== "undefined" && response.data.track.album.image[0]["#text"] != "") {
                                        $scope.crountryTracks[j].image = response.data.track.album.image;
                                    }
                                }
                            }
                            else {
                                console.log(response);
                            }
                        }, function (errResponse) {                            
                            if (errResponse.xhrStatus != "abort") {
                                console.log(errResponse);
                            }
                        }).finally(function () {
                            if ($scope.crountryTracks.length > 0 && $scope.crountryTracks[j].image !== "undefined" && $scope.crountryTracks[j].image[0]["#text"] == "") {
                                $scope.crountryTracks[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                            }

                            $scope.crountryTracks[j].imgsDone = true;
                        });
                    })(i)
                }
            }
            else {
                console.log(response);
            }
        }, function(errResponse) {
            if (errResponse.xhrStatus != "abort") {
                console.log(errResponse);
            }
        });
    };

    $scope.getArtistsByCountry = function (country, page, limit) {
        if (typeof page === "undefined") {
            var page = dft.page;
        }
        if (typeof limit === "undefined") {
            var limit = dft.limit;
        }

        var countryCode = $scope.countries[country];

        if (typeof $scope.artistsCountryAbort !== "undefined") { // prepare abort option
            $scope.artistsCountryAbort.resolve();
        }
        $scope.artistsCountryAbort = $q.defer();
        
        geoService.getArtistsByCountry(countryCode, page, limit, $scope.artistsCountryAbort.promise).then(function (response) {
            if (typeof response.data.error === "undefined") {
                $scope.crountryArtists = response.data.topartists.artist.slice(-limit);

                for (var i in $scope.crountryArtists) {
                    (function (j) {
                        artistsService.getArtistInfo($scope.crountryArtists[j].name, $scope.artistsCountryAbort.promise).then(function (response) {
                            if (typeof response.data.error === "undefined") {
                                if (typeof response.data.artist !== "undefined") {
                                    $scope.crountryArtists[j].info = response.data.artist;
                                    if (typeof response.data.artist.image !== "undefined" && response.data.artist.image[0]["#text"] != "") {
                                        $scope.crountryArtists[j].image = response.data.artist.image;
                                    }
                                }
                            }
                            else {
                                console.log(response);
                            }
                        }, function (errResponse) {                            
                            if (errResponse.xhrStatus != "abort") {
                                console.log(errResponse);
                            }
                        }).finally(function () {
                            if ($scope.crountryArtists.length > 0 && $scope.crountryArtists[j].image !== "undefined" && $scope.crountryArtists[j].image[0]["#text"] == "") {
                                $scope.crountryArtists[j].image = [{'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}, {'#text': $rootScope.fallbackImg}];
                            }

                            $scope.crountryArtists[j].imgsDone = true;
                        });
                    })(i)
                }
            }
            else {
                console.log(response);
            }
        }, function(errResponse) {
            if (errResponse.xhrStatus != "abort") {
                console.log(errResponse);
            }
        });
    };

    $scope.getAllByCountry = function () {
        $scope.getTracksByCountry($scope.currentCountry);
        $scope.getArtistsByCountry($scope.currentCountry);
    }

    // Get user location on render

    geoService.getUserLocation().then(function (response) {
        try {
            if (typeof response.data.error === "undefined") {
                $scope.currentCountry = $scope.tempCurrentCountry = geoService.alfa2ToName[response.data.country];
            }
            else {
                console.log(response);

                $scope.currentCountry = $scope.tempCurrentCountry = 'United States of America';
            }
        }
        catch (e) {
            console.log(response);

            $scope.currentCountry = $scope.tempCurrentCountry = 'United States of America';
        }
    }, function (errResponse) {
        console.log(errResponse);

        $scope.currentCountry = $scope.tempCurrentCountry = 'United States of America';
    }).finally(function () {
        $scope.getAllByCountry();
    });

    // Events and Actions

    $scope.searchByCountry = function (country) {
        if ($scope.instances.autocomplete[0].activeIndex == -1) { // User didn't choosed from autoselect
            $$('[by-country] .autocomplete')[0].blur();

            var result = $scope.countriesSearch.search(country);

            if (result.length > 0) {
                $scope.currentCountry = $scope.tempCurrentCountry = result[0].name;

                $scope.getAllByCountry();
            }
            else {
                M.toast({
                    html: 'Invalid country',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });
            }
        }
    };

    // Helpers

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
        scrollTo($$('.country .tabs')[0].offsetTop - $$('nav')[0].offsetHeight, 600);
    };
});