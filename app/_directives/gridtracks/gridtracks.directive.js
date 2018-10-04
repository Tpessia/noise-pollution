app.directive('gridTracks', function () {
    return {
        scope: {
            series: '='
        },
        controller: 'GridTracksController',
        templateUrl: 'app/_directives/gridtracks/gridtracks.partial.html'
    };
});