define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dgrid/OnDemandList',
    'app/views/Song'
], function (
    declare,
    lang,
    OnDemandList,
    Song
) {
    return declare('app/views/SongList', OnDemandList, {
        renderRow: function (object, options) {
            var div = document.createElement('div');

            var song = new Song({
                className: 'song',
                songId: object.id,
                title: object.title,
                scales: object.scales || []
            }, div);

            song.startup();

            song.on('song-delete', lang.hitch(this, function (event) {
                this.collection.remove(event.id);
                this.refresh();
            }));

            return div;
        }
    });
});
