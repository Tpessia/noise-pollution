app.service("topsService", function ($http, apiKeysService) {
    this.getTopTracks = function(page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=' + apiKeysService.getLastFmKey() + '&format=json&limit=' + encodeURIComponent(limit) + '&page=' + encodeURIComponent(page), { timeout: timeout });
    }

    this.getTopArtists = function(page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=' + apiKeysService.getLastFmKey() + '&format=json&limit=' + encodeURIComponent(limit) + '&page=' + encodeURIComponent(page), { timeout: timeout });
    }

    this.getTopTags = function(page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        // return $http.get('//ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key=' + apiKeysService.getLastFmKey() + '&format=json&limit=' + encodeURIComponent(limit) + '&page=' + encodeURIComponent(page));
        return $http.get('//ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key=' + apiKeysService.getLastFmKey() + '&format=json&limit=' + encodeURIComponent(page) * 5); // API is broken for tags, always showing page 1 (top 5)
    }

    this.getTopArtistsByTag = function(tag, page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=tag.gettopartists&api_key=' + apiKeysService.getLastFmKey() + '&format=json&limit=' + encodeURIComponent(limit) + '&tag=' + encodeURIComponent(tag) + '&page=' + encodeURIComponent(page), { timeout: timeout });
    }
});