$(document).ready(function() {
    spotify.login(function(err, token) {
        if (err) return;
        $('#logged-in').show();
        $('#not-logged-in').hide();
    });

    $('#login').click(function() {
        spotify.authorize()
    });

    $('#generate').click(function() {
        var songs = $('#songlist').val().split('\n');
        var playlistName = $('#name').val() || "Generated playlist";

        async.waterfall([
            function(callback) {
                spotify.createPlaylist(playlistName, callback);
            },
            function(playlist, callback) {
                async.filter(songs, function(song,callback) {
                    song = song.trim();
                    if (song) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                }, function (results) {
                    songs = results;
                    callback(null, playlist);
                });
            },
            function(playlist, callback) {
                var uris = [];
                async.each(songs, function(song, callback) {
                    song = song.replace(/[^a-zA-Z]/, '')
                               .replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, '').trim();
                    console.log(song);
                    spotify.search(song, function(err, data) {
                        if (err) return callback(err);
                        if (data.tracks.total != 0) uris.push(song = data.tracks.items[0].uri);
                        callback(null);
                    });
                }, function(err) {
                    callback(err, uris, playlist);
                });
            },
            function(uris, playlist, callback) {
                spotify.addSongsToPlaylist(playlist.id, uris);
            }
        ], function(err, result) {
            if (err) console.error(err);
            console.log("playlist ready")
        });
    });
});
