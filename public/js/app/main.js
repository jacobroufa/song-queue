define([
    'dojo/dom-construct',
    'dojo/_base/lang',
    'dojo/request',
    'dijit/layout/_LayoutWidget',
    'dijit/form/Button',
    'dijit/Dialog',
    'app/models/SongList',
    'app/views/SongForm',
    'app/views/SongList'
], function (
    domConstruct,
    lang,
    request,
    _LayoutWidget,
    Button,
    Dialog,
    SongListModel,
    SongForm,
    SongList
) {

    return _LayoutWidget.createSubclass({

        baseClass: 'songQueue application-main',

        scales: null,

        keys: null,

        constructor: function () {
            this.songs = [];
            this.currentSong = this.songs.length;

            this.songListModel = new SongListModel({
                dbConfig: {
                    version: 1,
                    stores: {
                        songs: {
                            title: 50,
                            id: {
                                autoIncrement: true,
                                preference: 100
                            },
                            scales: {
                                multiEntry: true,
                                preference: 10
                            }
                        }
                    }
                },
                storeName: 'songs'
            });
        },

        postMixInProperties: function () {
            this.inherited(arguments);

            this.scales = this.scales.map(function (scale) {
                return scale.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            });
        },

        buildRendering: function () {
            this.inherited(arguments);

            if (!this.newSongForm) {
                this.newSongForm = new Dialog({
                    title: 'Add a New Song',
                    content: new SongForm({
                        keys: this.keys,
                        scales: this.scales
                    })
                });
                this.newSongForm.startup();
            }

            var buttons = domConstruct.create('div', {
                className: 'buttons',
            }, this.domNode);
            var content = domConstruct.create('div', {
                className: 'content',
            }, this.domNode);

            var prevButton = this._prevButton = new Button({
                label: 'Previous Song',
                onClick: lang.hitch(this, function (event) {
                    event.preventDefault();
                    this._prevSong();
                })
            });

            var newSongButton = this._newSongButton = new Button({
                label: 'Add Another Song',
                onClick: lang.hitch(this, function (event) {
                    event.preventDefault();
                    this.newSongForm.show();
                })
            });

            var nextButton = this._nextButton = new Button({
                label: 'Next Song',
                onClick: lang.hitch(this, function (event) {
                    event.preventDefault();
                    this._nextSong();
                })
            });

            prevButton.placeAt(buttons, 'last');
            newSongButton.placeAt(buttons, 'last');
            nextButton.placeAt(buttons, 'last');

            this.songList = new SongList({
                collection: this.songListModel
            }, content);
        },

        startup: function () {
            this.inherited(arguments);

            this.currentSong = 0;

            this._prevButton.startup();
            this._newSongButton.startup();
            this._nextButton.startup();
            this.songList.startup();
        },

        postCreate: function () {
            this.inherited(arguments);

            this.newSongForm.content.on('newSong', lang.hitch(this, function (event) {
                this.songListModel.add({
                    title: event.title,
                    keys: event.keys,
                    modes: event.modes
                }).then(lang.hitch(this, function () {
                    this.newSongForm.hide();
                    this.songList.refresh();
                }));
            }));
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

        _showCurrentSong: function () {
            this._closeSongs();

            this.songs[this.currentSong].open();
        },

        _closeSongs: function () {
            this.songs[this.lastSong].close();
        }

    });
});
