var spotify = {
    clientId: "a9c36b0a94ae4f1ca8bc725f936c9e36",
    search: function(query, callback) {
        $.ajax({
            url: "https://api.spotify.com/v1/search",
            data: { q: query, type: "track", limit: 1 }
        }).done(function( data ) {
            if (typeof callback == "function") {
                callback(null, data);
            }
        });
    },
    login: function(callback) {
        spotify.token = location.hash.split("&")[0].split("=")[1];
        if (spotify.token && typeof callback == "function") {
            $.ajax({
                url: "https://api.spotify.com/v1/me",
                headers: { 'Authorization': 'Bearer ' + spotify.token }
            }).done(function(data) {
                spotify.user = data;
                return callback(null, data); 
            }).fail(function() {
                spotify.authorize();
            });
        }
        callback("No token set");
    },
    authorize: function() {
        location.href = "https://accounts.spotify.com/authorize?client_id=" + spotify.clientId 
                        + "&response_type=token"
                        + "&redirect_uri=" + location.href
                        + "&scope=playlist-modify-private"
    },
    createPlaylist: function(name, callback) {
        $.ajax({
            type: 'POST',
            url: "https://api.spotify.com/v1/users/" + spotify.user.id  + "/playlists",
            headers: { 'Authorization': 'Bearer ' + spotify.token },
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify({ name: name, public: false })
        }).done(function(data) {
            if (typeof callback == "function") callback(null, data);
        });
    },
    addSongsToPlaylist: function(playlist, songs) {
        $.ajax({
            type: 'POST',
            url: 'https://api.spotify.com/v1/users/' + spotify.user.id + '/playlists/' + playlist + '/tracks',
            headers: { 'Authorization': 'Bearer ' + spotify.token },
            contentType: 'application/json',
            data: JSON.stringify({ uris: songs })
        });
    }
}
