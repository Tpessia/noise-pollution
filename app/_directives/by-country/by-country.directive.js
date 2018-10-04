app.directive('byCountry', function () {
    return {
        controller: 'ByCountryController',
        templateUrl: 'app/_directives/by-country/by-country.partial.html',
        link: function (scope, element, attrs, geoService) {
            var autoCountries = {};
            for (var i in scope.countries) {
                autoCountries[i] = null;
            }

            scope.instances = {
                tabs: M.Tabs.init($$('.tabs'), {
                    swipeable: function () {
                        return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    }
                }),
                autocomplete: M.Autocomplete.init($$('.autocomplete'), {
                    data: autoCountries,
                    limit: 3,
                    onAutocomplete: function (country) {
                        $$('[by-country] .autocomplete')[0].blur();
                        
                        scope.currentCountry = country;

                        scope.getAllByCountry();
                    }
                })
            }
        }
    };
});