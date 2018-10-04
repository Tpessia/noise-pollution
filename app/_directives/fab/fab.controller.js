app.controller("MaterializeFabController", function ($scope, userService) {
    $scope.user = userService.user;
    
    $scope.onPlaylistSelect = function (playlistId) {
        $scope.add({
            'playlistId': playlistId
        });
    };
});