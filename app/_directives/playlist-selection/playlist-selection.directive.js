app.directive('playlistSelection', function () {
    return {
        scope: {
            index: '=',
            onSelect: '&'
        },
        controller: 'PlaylistSelectionController',
        templateUrl: 'app/_directives/playlist-selection/playlist-selection.partial.html',
        link: function (scope, element, attr) {
            setTimeout(function () {
                scope.instances = M.Modal.init($$('#playlist-selection-' + scope.index), {
                    onOpenStart: scope.onModalOpen
                });
            }, 100);
        }
    };
});