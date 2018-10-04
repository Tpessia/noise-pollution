app.controller("YTPlayerController", function ($rootScope, $scope, $sce, youTubeService) {

    // Player controls

    $scope.isOpen = false;
    $scope.isExpanded = false;
    $scope.isVisible = true;

    $scope.close = function () {
        $scope.isOpen = false;
        cleanPlayer();
    }

    $scope.expand = function () {
        $scope.isExpanded = !$scope.isExpanded;
    }

    $scope.visibility = function () {
        $scope.isVisible = !$scope.isVisible;
    }

    // Player state

    cleanPlayer();
    function cleanPlayer() {
        $scope.isVisible = true;
        delete $scope.YTplayer;
        delete $scope.videoUrl; // force change to trigger player (fix module bug)
        $scope.playerVars = {
            autoplay: 1,
            playsinline: 1,
            rel: 0
        };
    }

    $scope.$on('youtube.player.ready', function ($event, player) {
        $scope.YTplayer = player;
    });    

    // Event receiver

    $scope.$on('ytPlayVideo', function (event, videoData) {
        // { type: 'track', artist: 'Portugal. The Man', track: 'Noise Pollution' }
        switch (videoData.type) {
            case 'id':
                $scope.isOpen = true;
                playVideoId(videoData.id);
                break;
            case 'track':
                $scope.isOpen = true;
                playTrackVideo(videoData.artist, videoData.track);
                break;
            case 'album':
                $scope.isOpen = true;
                playAlbumPlaylist(videoData.artist, videoData.album);
                break;
            case 'artist':
                $scope.isOpen = true;
                playArtistPlaylist(videoData.artist);
                break;
            default:
                throw 'Invalid video type "' + videoData.type + '"';
                break;
        }
    });

    $scope.$on('ytPlayCustomPlaylist', function (event, playlist) {
        // ['123456', '654321']
        $scope.isOpen = true;
        cleanPlayer();
        $scope.playerVars.playlist = playlist.map(function (elem) {
            return elem.videoId;
        }).join(",");;
    });

    // Video getters

    function playVideoId(id) {
        cleanPlayer();
        $scope.videoUrl = id;
    }

    function playTrackVideo(artist, track) {
        youTubeService.getMusicVideo(artist, track).then(function (response) {
            var video = response.data.items[0],
                id = video.id.videoId;

            cleanPlayer();
            $scope.videoUrl = id;
        }, function (errResponse) {
            console.log(errResponse)
        });
    }

    function playAlbumPlaylist(artist, album) {
        youTubeService.getAlbumPlaylist(artist, album).then(function (response) {
            var playlist = response.data.items[0],
                id = playlist.id.playlistId;
                
            cleanPlayer();
            $scope.playerVars.list = id;
        }, function (errResponse) {
            console.log(errResponse)
        });
    }

    function playArtistPlaylist(artist) {
        youTubeService.getArtistPlaylist(artist).then(function (response) {
            var playlist = response.data.items[0],
                id = playlist.id.playlistId;

            cleanPlayer();
            $scope.playerVars.list = id;
        }, function (errResponse) {
            console.log(errResponse)
        });
    }

    // Na Controller que chama o YouTube:
    // $scope.ytPlayVideo = function(videoData) {
    //     $rootScope.$broadcast('ytPlayVideo', videoData);
    //     // { type: 'track', artist: 'Portugal. The Man', track: 'Noise Pollution' }
    // }
});