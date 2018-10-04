app.controller("PlaylistSelectionController", function ($scope, userService) {
    $scope.onModalOpen = function () {
        $scope.$apply(function() {
            $scope.playlists = userService.savedPlaylists.getAllPlaylists();
        });
    };
    
    $scope.selectPlaylist = function (playlistId) {
        addPlaylist(playlistId);
    };

    $scope.createPlaylist = function (playlistName) {
        userService.savedPlaylists.newPlaylist(playlistName).then(function (response) {
            if (typeof response.data.PlaylistID !== "undefined") {
                addPlaylist(response.data.PlaylistID);
                M.toast({
                    html: 'Playlist created',
                    displayLength: '2000'
                });
            }
            else {
                M.toast({
                    html: 'Error on playlist creation',
                    classes: 'red darken-4',
                    displayLength: '2000'
                });

                console.log(response)
            }
        }, function (errResponse) {
            console.log(errResponse);
        });
    }

    function addPlaylist(playlistId) {
        $scope.onSelect({ 'playlistId': playlistId });
        $scope.instances[0].close();
        $scope.newPlaylist = "";
    };
});