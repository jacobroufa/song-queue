define([
    'dojo/dom-construct',
    'dojo/_base/lang',
    'dojo/request',
    'dijit/layout/_LayoutWidget',
    'dijit/form/Button',
    'dijit/form/ComboButton',
    'dijit/Dialog',
    'dijit/Menu',
    'dijit/MenuItem',
    'app/models/SongList',
    'app/models/Settings',
    'app/views/SongForm',
    'app/views/ScaleDisplayForm',
    'app/views/SongList'
], function (
    domConstruct,
    lang,
    request,
    _LayoutWidget,
    Button,
    ComboButton,
    Dialog,
    Menu,
    MenuItem,
    SongListModel,
    SettingsModel,
    SongForm,
    ScaleDisplayForm,
    SongList
) {

    return _LayoutWidget.createSubclass({

        baseClass: 'songQueue application-main',

        scales: null,

        keys: null,

        dbConfig: null,

        constructor: function () {
            // TODO: make current song tracking and "pagination" work
            this.songs = [];
            this.currentSong = this.songs.length;
        },

        postMixInProperties: function () {
            this.inherited(arguments);

            this.scales = this.scales.map(function (scale) {
                return scale.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            });

            this.songListModel = new SongListModel({
                dbConfig: this.dbConfig,
                storeName: 'songs'
            });

            this.settingsModel = new SettingsModel({
                dbConfig: this.dbConfig,
                storeName: 'settings'
            });
        },

        buildRendering: function () {
            this.inherited(arguments);

            this.settingsModel.get('Display Mode').then(lang.hitch(this, function (mode) {
                var content = domConstruct.create('div', {
                    className: 'content'
                }, this.domNode, 'last');
                this.songList = new SongList({
                    collection: this.songListModel,
                    displayMode: mode.value
                }, content);
                this.songList.startup();

                // TODO: move this out of buildRendering somehow, and finish wiring it up
                this.songList.on('song-edit', lang.hitch(this, function (event) {
                    this.songListModel.get(event.id).then(lang.hitch(this, function (song) {
                        this.newSongForm.content.set('value', song);
                        this.newSongForm.show();
                    }));
                }));
            }));

            if (!this.scaleDisplayForm) {
                this.scaleDisplayForm = new Dialog({
                    title: 'Toggle Scale Display',
                    content: new ScaleDisplayForm()
                });
                this.scaleDisplayForm.startup();
            }

            if (!this.newSongForm) {
                this.newSongForm = new Dialog({
                    title: 'Add a New Song',
                    content: new SongForm({
                        className: 'newSongForm',
                        keys: this.keys,
                        scales: this.scales
                    })
                });
                this.newSongForm.startup();
            }

            var buttons = domConstruct.create('div', {
                className: 'buttons'
            }, this.domNode, 'first');
            var settings = domConstruct.create('div', {
                className: 'settings'
            }, 'header', 'last');

            var settingsMenu = this._settingsMenu = new Menu({ style: 'display: none;' });
            var songDisplayToggle = new MenuItem({
                label: 'Toggle Scale Display',
                onClick: lang.hitch(this, function () {
                    this.scaleDisplayForm.show();
                })
            });
            var exportSongs = new MenuItem({
                label: 'Export Songs',
                onClick: lang.hitch(this, function () {
                    this._exportSongs();
                })
            });

            settingsMenu.addChild(songDisplayToggle);
            settingsMenu.addChild(exportSongs);

            var settingsButton = this._settingsButton = new ComboButton({
                label: 'Settings',
                dropDown: settingsMenu
            });

            var prevButton = this._prevButton = new Button({
                disabled: true,
                label: 'Previous Song',
                onClick: lang.hitch(this, function () {
                    this._prevSong();
                })
            });

            var newSongButton = this._newSongButton = new Button({
                label: 'Add Another Song',
                onClick: lang.hitch(this, function () {
                    this.newSongForm.show();
                })
            });

            var nextButton = this._nextButton = new Button({
                disabled: true,
                label: 'Next Song',
                onClick: lang.hitch(this, function () {
                    this._nextSong();
                })
            });

            prevButton.placeAt(buttons, 'last');
            newSongButton.placeAt(buttons, 'last');
            nextButton.placeAt(buttons, 'last');

            settingsButton.placeAt(settings);
        },

        startup: function () {
            this.inherited(arguments);

            this.currentSong = 0;

            this._settingsMenu.startup();
            this._settingsButton.startup();
            this._prevButton.startup();
            this._newSongButton.startup();
            this._nextButton.startup();
        },

        postCreate: function () {
            this.inherited(arguments);

            this.settingsModel.get('Display Mode').then(lang.hitch(this, function (mode) {
                this.scaleDisplayForm.content.scaleDisplaySelect.set('value', mode.value);
            }));

            this.scaleDisplayForm.content.on('settingsSave', lang.hitch(this, function (event) {
                this.settingsModel.put({
                    id: 'Display Mode',
                    value: event.displayMode
                }).then(lang.hitch(this, function (object) {
                    this.scaleDisplayForm.hide();
                    this.songList.set('displayMode', event.displayMode);
                    this.songList.refresh();
                }));
            }));

            this.newSongForm.on('hide', lang.hitch(this, function () {
                this.newSongForm.content.set('value', '');
            }));

            this.newSongForm.content.on('songForm', lang.hitch(this, function (event) {
                this.songListModel.put({
                    id: event.id || null,
                    title: event.title,
                    keys: event.keys
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
        },

        _exportSongs: function () {
            console.log('TODO: implement song export!');
        }

    });
});
