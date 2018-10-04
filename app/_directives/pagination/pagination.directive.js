app.directive('materializePag', function () {
    return {
        scope: {
            runOnInit: '=',
            maxPage: '=',
            pageChangeFunc: '&',
            onClick: '&?'
        },
        controller: 'PaginationController',
        templateUrl: 'app/_directives/pagination/pagination.partial.html'
    };
});