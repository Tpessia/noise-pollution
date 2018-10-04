app.service("tracksService", function ($http, apiKeysService) {
    this.getTrackInfo = function (artist, track, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }
        
        return $http.get('//ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + apiKeysService.getLastFmKey() + '&format=json&artist=' + encodeURIComponent(artist) + '&track=' + encodeURIComponent(track), { timeout: timeout });
    }

    this.getTrackSearch = function (track, page, limit, timeout) {
        if (typeof timeout === "undefined") {
            timeout = null;
        }

        return $http.get('//ws.audioscrobbler.com/2.0/?method=track.search&api_key=' + apiKeysService.getLastFmKey() +'&format=json&track=' + encodeURIComponent(track) + '&limit=' + encodeURIComponent(limit) + '&page=' + encodeURIComponent(page), { timeout: timeout });
    }
});