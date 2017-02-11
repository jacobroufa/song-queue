define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/Evented',
    'dijit/layout/ContentPane',
    'dijit/form/TextBox',
    'dijit/form/Button',
    'app/views/KeyModeSelectContainer'
], function (
    declare,
    lang,
    domConstruct,
    Evented,
    ContentPane,
    TextBox,
    Button,
    KeyModeSelectContainer
) {
    return declare('app/views/SongForm', [ContentPane, Evented], {
        keys: null,
        scales: null,
        value: null,
        editId: null,
        mode: null,

        buildRendering: function () {
            this.inherited(arguments);

            var nameContainer = domConstruct.create('div', null, this.domNode);
            domConstruct.create('label', {
                for: 'title',
                innerHTML: 'Song Title'
            }, nameContainer);
            this.songName = new TextBox({
                name: 'title'
            });
            this.songName.placeAt(nameContainer);

            var keysContainer = domConstruct.create('div', null, this.domNode);

            var keyModeSelect = this.songKeys = new KeyModeSelectContainer({
                className: 'keyModeSelectContainer',
                keys: this.keys,
                modes: ['major', 'minor']
            });
            keyModeSelect.placeAt(keysContainer);

            var buttonContainer = domConstruct.create('div', null, this.domNode);
            this.createNewSong = new Button({
                label: this.mode + ' Song',
                onClick: lang.hitch(this, function (event) {
                    event.preventDefault();

                    var title = this.songName.get('value');
                    var keys = this.songKeys.get('value');

                    this.emit('songForm', {
                        id: this.editId || null,
                        title: title,
                        keys: keys,
                    });

                    this.set('value', '');
                })
            });
            this.createNewSong.placeAt(buttonContainer);
        },

        startup: function () {
            this.inherited(arguments);

            this.songName.startup();
            this.songKeys.startup();
            this.createNewSong.startup();
        },

        _setValueAttr: function (value) {
            if (value === '') {
                this.editId = null;
                this.songName.set('value', '');
                this.songKeys.set('value', '');
            } else if (typeof value === 'object') {
                this.editId = value.id;
                this.songName.set('value', value.title);
                this.songKeys.set('value', Object.keys(value.scales));
            }

            this.value = value;
        },

        _setModeAttr: function (mode) {
            this.createNewSong.set('label', mode + ' Song');
            this.mode = mode;
        }
    });
});
