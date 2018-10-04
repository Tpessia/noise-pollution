app.directive('gridAlbums', function () {
    return {
        scope: {
            series: '='
        },
        controller: 'GridAlbumsController',
        templateUrl: 'app/_directives/gridalbums/gridalbums.partial.html'
    };
});