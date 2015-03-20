$(document).ready(function() {
    spotify.login(function(err, token) {
        console.log(token);
    });

    $('#generate').click(function() {
        var songs = $('#songlist').val().split('\n');
        var playlistName = $('#name').val() || "Generated playlist";

        async.waterfall([
            function(callback) {
                spotify.createPlaylist(playlistName, callback);
            },
            function(playlist, callback) {
                async.map(songs, function(song, callback) {
                    spotify.search(song, function(err, data) {
                        if (err) return callback(err);
                        if (data.tracks.total != 0) song = data.tracks.items[0].uri;
                        callback(null, song);
                    });
                }, function(err, songs) {
                    callback(err, songs, playlist);
                });
            },
            function(uris, playlist, callback) {
                spotify.addSongsToPlaylist(playlist.id, uris);
            }
        ], function(err, result) {
            console.log("playlist ready")
        });
    });
});
