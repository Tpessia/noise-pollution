app.directive('materializeVideoFab', function () {
    return {
        scope: {
            index: '=',
            play: '&',
            add: '&'
        },
        controller: 'MaterializeFabController',
        templateUrl: 'app/_directives/fab/fab.partial.html',
        link: function (scope, element, attrs) {
            setTimeout(function() {
                var instances = M.FloatingActionButton.init($$('.video-fab'), {
                    direction: 'bottom',
                    hoverEnabled: false
                });
            }, 100);
        }
    };
});