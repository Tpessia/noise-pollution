app.controller("HeaderController", function ($rootScope, $scope, $location, topsService, userService) {

    $scope.navItems = {
        main: [{
                text: 'Home',
                url: '/'
            }, {
                text: 'Tracks',
                url: '/tracks'
            }, {
                text: 'Artists',
                url: '/artists'
            }, {
                text: 'Albums',
                url: '/albums'
            }],
        user: [{
                text: 'Playlists',
                url: '/user/playlists'
            }, {
                text: 'Settings',
                url: '/user'
            }]
    };
    
    $scope.isActive = function(url) {
        return url == $location.path();
    };

    var dft = {
        page: 1,
        limit: 5
    };

    getHeaderImgs();
    function getHeaderImgs() {

        $scope.headerImgs = {};

        $scope.headerImgs.topTrack = $rootScope.fallbackImg;
        $scope.headerImgs.topArtist = $rootScope.fallbackImg;
        $scope.headerImgs.topTag = $rootScope.fallbackImg;

        topsService.getTopTracks(dft.page, dft.limit).then(function (response) {
            if (typeof response.data.error === "undefined") {
                    if (typeof response.data.tracks !== "undefined") {
                        if (typeof response.data.tracks.track[0].image !== "undefined" && response.data.tracks.track[0].image[0]["#text"] != "") {
                            
                            $scope.headerImgs.topTrack = getUniqueImg(response.data.tracks.track, $scope.headerImgs);
                            
                        }
                    }
                } else {
                    console.log(response);
                }
        }, function (errResponse) {
            $scope.headerImgs.topTrack = $rootScope.fallbackImg;

            console.log("Error while fetching tops (header) images: " + errResponse);
        });

        topsService.getTopArtists(dft.page, dft.limit).then(function (response) {
            if (typeof response.data.error === "undefined") {
                    if (typeof response.data.artists !== "undefined") {
                        if (typeof response.data.artists.artist[0].image !== "undefined" && response.data.artists.artist[0].image[0]["#text"] != "") {

                            $scope.headerImgs.topArtist = getUniqueImg(response.data.artists.artist, $scope.headerImgs);
                            
                        }
                    }
                } else {
                    console.log(response);
                }
        }, function (errResponse) {
            $scope.headerImgs.topArtist = $rootScope.fallbackImg;

            console.log("Error while fetching tops (header) images: " + errResponse);
        });

        topsService.getTopTags(dft.page, dft.limit).then(function (response) {
            var tag = response.data.tags.tag[0].name;
            topsService.getTopArtistsByTag(tag).then(function (response) {
                if (typeof response.data.error === "undefined") {
                    if (typeof response.data.topartists !== "undefined") {
                        if (typeof response.data.topartists.artist[0].image !== "undefined" && response.data.topartists.artist[0].image[0]["#text"] != "") {

                            $scope.headerImgs.topTag = getUniqueImg(response.data.topartists.artist, $scope.headerImgs);
                            
                        }
                    }
                } else {
                    console.log(response);
                }
            }, function (errResponse) {
                $scope.headerImgs.topTag = $rootScope.fallbackImg;

                console.log("Error while fetching tops (header) images: " + errResponse);
            });
        });

        function getUniqueImg(dataArray, headerImgs) {
            var img = "";

            for (var i in dataArray) {
                img = dataArray[i].image.pop()['#text'];

                for (var j in headerImgs) {
                    if (img == headerImgs[j]) {
                        img = "";
                        break;
                    }
                }

                if (img != "") {
                    break;
                }
            }

            if (img == "") {
                img = $rootScope.fallbackImg;
            }
            
            return img;
        }
    };
});