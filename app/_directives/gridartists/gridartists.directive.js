app.directive('gridArtists', function () {
    return {
        scope: {
            series: '='
        },
        controller: 'GridArtistsController',
        templateUrl: 'app/_directives/gridartists/gridartists.partial.html'
    };
});