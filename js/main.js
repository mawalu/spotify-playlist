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
                var uris = [];
                async.each(songs, function(song, callback) {
                    spotify.search(song, function(err, data) {
                        if (data.tracks.total != 0) uris.push(data.tracks.items[0].uri);
                        callback();
                    });
                }, function(err) {
                    console.log(uris);
                    callback(err, uris, playlist);
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
