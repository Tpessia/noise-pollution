app.controller("BreadcrumbController", function ($rootScope, $scope, $location) {

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        
        // Breadcrumb items

        var breadcrumbItems = current.$$route.originalPath.split(/\//g).filter(function (e) { // Create breadcrumb path array
            return e != ""
        });
        
        breadcrumbItems.length == 0 ? breadcrumbItems[0] = 'home' : breadcrumbItems.unshift('home'); // Transform '/' to 'home'

        $scope.breadcrumb = [];
        for (var i in breadcrumbItems) {
            $scope.breadcrumb.push({
                name: breadcrumbItems[i],
                path: '#!/' + breadcrumbItems.filter(function (e, index) {
                    return index <= i
                }).filter(function (e) {
                    return e != 'home'
                }).join('/')
            });
        }

    });

});