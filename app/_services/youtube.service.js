app.service("youTubeService", function ($http, apiKeysService) {
    this.getMusicVideo = function (artist, track) {
        return $http.get('https://content.googleapis.com/youtube/v3/search?key=' + apiKeysService.getYouTubeKey() + '&part=id%2Csnippet&videoEmbeddable =true&maxResults=1&type=video&q=' + encodeURIComponent(artist + " - " + track));
    }

    this.getAlbumPlaylist = function (artist, album) {
        return $http.get('https://content.googleapis.com/youtube/v3/search?key=' + apiKeysService.getYouTubeKey() + '&part=id%2Csnippet&videoEmbeddable =true&maxResults=1&type=playlist&q=' + encodeURIComponent(artist + " - " + album));
    }

    this.getArtistPlaylist = function (artist) {
        return $http.get('https://content.googleapis.com/youtube/v3/search?key=' + apiKeysService.getYouTubeKey() + '&part=id%2Csnippet&videoEmbeddable =true&maxResults=1&type=playlist&q=' + encodeURIComponent(artist));
    }


    this.getPlaylistVideos = function (playlistId, pageToken) {
        var pg = pageToken ? '&pageToken=' + pageToken : '';

        return $http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' + apiKeysService.getYouTubeKey() + '&part=snippet,contentDetails&maxResults=50' + pg + '&playlistId=' + playlistId, {
            cache: true
        });
    }
});

