var app = angular.module('noisePolution', ['ngRoute', 'youtube-embed', 'angularFileUpload']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/',
            {
                title: '',
                controller: 'HomeController',
                templateUrl: 'app/home/home.partial.html'
            })
        .when('/tracks',
            {
                title: 'Tracks',
                controller: 'TracksController',
                templateUrl: 'app/tracks/tracks.partial.html',
                // reloadOnSearch: false
            })
        .when('/artists',
            {
                title: 'Artists',
                controller: 'ArtistsController',
                templateUrl: 'app/artists/artists.partial.html',
                // reloadOnSearch: false
            })
        .when('/albums',
            {
                title: 'Albums',
                controller: 'AlbumsController',
                templateUrl: 'app/albums/albums.partial.html',
                // reloadOnSearch: false
            })
        .when('/user/playlists',
        {
            title: 'User Playlists',
            controller: 'UserPlaylistsController',
            templateUrl: 'app/userplaylists/userplaylists.partial.html',
            reloadOnSearch: false
        })
        .when('/user',
        {
            title: 'User Settings',
            controller: 'UserSettingsController',
            templateUrl: 'app/usersettings/usersettings.partial.html'
        })
        .otherwise({ redirectTo: '/' });

    // $locationProvider.html5Mode(true);
});

// App Run

app.run(function ($rootScope, $window, $timeout) {

    // Route change

    $rootScope.$on('$routeChangeSuccess', function ($event, current, previous) {

        // Change Title

        $rootScope.title = current.$$route.title;
        $rootScope.titleClass = current.$$route.title == '' ? 'home' : current.$$route.title.toLowerCase().replace(/ /g, "");
        
        // Scroll to Top

        if (typeof previous !== "undefined" && current.$$route.originalPath != previous.$$route.originalPath) { // check if redirect or reload
            scrollTo(0, 10);
        }
    });



    // Base URLs

    $rootScope.baseUrl = $window.location.pathname.substring(0, $window.location.pathname.lastIndexOf("/")) + '/';
    
    $rootScope.fallbackImg = $rootScope.baseUrl + 'assets/img/logo-simple-512x512.png';

    

    // Materialize init functions

    $rootScope.materialize = {
        headerDropdown: function () {
            return M.Dropdown.init($$('#user-dropdown')[0], {
                // coverTrigger: false,
                alignment: 'right'
            });
        },
        sidenav: function () {
            var instance = M.Sidenav.getInstance($$(".sidenav")[0]);

            var sidenav = (typeof instance === "undefined" ? M.Sidenav.init($$('.sidenav')[0], {}) : instance);

            angular.element($$('.sidenav li:not(.init), .user-view a:not(.init)')).on('click', function () {
                sidenav.close();
            }).addClass('init');

            return sidenav;
        },
        all: function () {
            var dropdown = this.headerDropdown();
            var sidenav = this.sidenav();
            
            return {
                headerDropdown: dropdown,
                sidenav: sidenav
            };
        }
    }
    $timeout(function () {
        $rootScope.materialize.all();
    }, 10);

    // Dev shortcut

    angular.get = function(injector) {
        return angular.element(document.body).injector().get(injector);
    }
    
});