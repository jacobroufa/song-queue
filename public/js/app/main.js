define([
    'dojo/dom-construct',
    'dojo/_base/lang',
    'dojo/request',
    'dijit/layout/_LayoutWidget',
    'dijit/form/Button',
    'dijit/Dialog',
    'app/views/SongForm'
], function (
    domConstruct,
    lang,
    request,
    _LayoutWidget,
    Button,
    Dialog,
    SongForm
) {

    return _LayoutWidget.createSubclass({

        baseClass: 'songQueue application-main',

        constructor: function () {
            this.songs = [];
            this.currentSong = this.songs.length;
        },

        buildRendering: function () {
            this.inherited(arguments);

            if (!this.newSongForm) {
                this._getScaleList().then(lang.hitch(this, function () {
                    this.newSongForm = new Dialog({
                        title: 'Add a New Song',
                        content: new SongForm({
                            scales: this._scaleList
                        })
                    });
                    this.newSongForm.startup();
                }));
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

            // TODO:
            // make container for songs -- app/views/SongList
        },

        startup: function () {
            this.inherited(arguments);

            this.currentSong = 0;

            this._prevButton.startup();
            this._newSongButton.startup();
            this._nextButton.startup();
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
        },

        _getScaleList: function () {
            return request.get('/scales', {
                handleAs: 'json'
            }).then(lang.hitch(this, function (data) {
                this._scaleList = data.scales.map(function (scale) {
                    return scale.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                });
            }));
        }

    });
});
