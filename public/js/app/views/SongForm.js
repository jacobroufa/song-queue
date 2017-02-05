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
                label: 'Add Song',
                onClick: lang.hitch(this, function (event) {
                    event.preventDefault();

                    var title = this.songName.get('value');
                    var keys = this.songKeys.get('value');

                    this.emit('newSong', {
                        title: title,
                        keys: keys,
                    });

                    this.songName.set('value', '');
                    this.songKeys.set('value', '');
                })
            });
            this.createNewSong.placeAt(buttonContainer);
        },

        startup: function () {
            this.inherited(arguments);

            this.songName.startup();
            this.songKeys.startup();
            this.createNewSong.startup();
        }
    });
});
