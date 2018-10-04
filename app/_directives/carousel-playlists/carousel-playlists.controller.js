app.controller("CarouselPlaylistsController", function ($rootScope, $scope) {
    $scope.fallbackImg = $rootScope.fallbackImg;
    
    $scope.$watch('focusedElem', function (newElem, oldElem) {
        if (newElem !== oldElem && typeof oldElem !== "undefined") {
            var playlistId = newElem.getAttribute('data-playlist-id');
            $scope.onSlide({ 'playlistId': playlistId });
        }
    });
});