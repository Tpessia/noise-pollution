app.service("albumsService", function ($http, apiKeysService) {
    this.getAlbumInfo = function (artist, album, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + apiKeysService.getLastFmKey() + '&format=json&album=' + encodeURIComponent(album) + '&artist=' + encodeURIComponent(artist), { timeout: timeout });
    }

    this.getAlbumSearch = function (album, page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=album.search&api_key=' + apiKeysService.getLastFmKey() +'&format=json&album=' + encodeURIComponent(album) + '&limit=' + encodeURIComponent(limit) + '&page=' + encodeURIComponent(page), { timeout: timeout });
    }
});