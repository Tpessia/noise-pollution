app.service("artistsService", function ($http, apiKeysService) {
    this.getArtistInfo = function (artist, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=' + apiKeysService.getLastFmKey() + '&format=json&artist=' + encodeURIComponent(artist), { timeout: timeout });
    }

    this.getArtistSearch = function (artist, page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=artist.search&api_key=' + apiKeysService.getLastFmKey() +'&format=json&artist=' + encodeURIComponent(artist) + '&limit=' + encodeURIComponent(limit) + '&page=' + encodeURIComponent(page), { timeout: timeout });
    }

    this.getTopAlbums = function (artist, page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=' + apiKeysService.getLastFmKey() +'&format=json&artist=' + encodeURIComponent(artist) + '&limit=' + encodeURIComponent(limit) + '&page=' + encodeURIComponent(page), { timeout: timeout });
    }
});