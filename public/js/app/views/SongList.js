define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/Evented',
    'dgrid/OnDemandList',
    'app/views/Song'
], function (
    declare,
    lang,
    Evented,
    OnDemandList,
    Song
) {
    return declare('app/views/SongList', [OnDemandList, Evented], {
        displayMode: null,

        renderRow: function (object, options) {
            var div = document.createElement('div');

            var song = new Song({
                className: 'song',
                songId: object.id,
                title: object.title,
                scales: object.scales || [],
                displayMode: this.displayMode
            }, div);

            song.startup();

            song.on('song-delete', lang.hitch(this, function (event) {
                this.collection.remove(event.id);
                this.refresh();
            }));

            song.on('song-edit', lang.hitch(this, function (event) {
                this.emit('song-edit', { id: event.id });
            }));

            return div;
        }
    });
});
