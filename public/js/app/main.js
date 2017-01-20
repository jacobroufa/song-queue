define([
    'dojo/dom-construct',
    'dijit/layout/_LayoutWidget'
], function (domConstruct, _LayoutWidget) {

    return _LayoutWidget.createSubclass({

        baseClass: 'songQueue application-main',

        constructor: function () {
            this.songs = [];
            this.currentSong = this.songs.length;
        },

        buildRendering: function () {
            this.inherited(arguments);

            var buttons = domConstruct.create('div', null, this.domNode);
            var content = domConstruct.create('div', null, this.domNode);
            var footer = domConstruct.create('div', null, this.domNode);

            // TODO:
            // make buttons for forward and back through songs
            // make container for songs -- app/views/SongList
            // make New Song button -- app/views/NewSongForm
        },

        startup: function () {
            this.inherited(arguments);

            this.currentSong = 0;
        },

        _nextSong: function () {
            this.lastSong = this.currentSong;
            this.currentSong++;

            if (this.currentSong > this.songs.length) {
                this.currentSong = this.songs.length;
            }

            this._showCurrentSong();
        },

        _prevSong: function () {
            this.lastSong = this.currentSong;
            this.currentSong--;

            if (this.currentSong < 0) {
                this.currentSong = 0;
            }

            this._showCurrentSong();
        },

        _showSong: function (index) {
            this._closeSongs();

            this.songs[this.currentSong].open();
        },

        _closeSongs: function () {
            this.songs[this.lastSong].close();
        }

    });
});
