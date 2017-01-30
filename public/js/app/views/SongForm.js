define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/Evented',
    'dijit/layout/ContentPane',
    'dijit/form/TextBox',
    'dijit/form/MultiSelect',
    'dijit/form/Button'
], function (
    declare,
    lang,
    domConstruct,
    Evented,
    ContentPane,
    TextBox,
    MultiSelect,
    Button
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

            var songKeysContainer = domConstruct.create('div', null, keysContainer);
            domConstruct.create('label', {
                for: 'songKey',
                innerHTML: 'Song Key'
            }, songKeysContainer);
            var songKeys = domConstruct.create('select', null, songKeysContainer);
            this.keys.forEach(function (key) {
                domConstruct.create('option', {
                    label: key,
                    value: encodeURIComponent(key)
                }, songKeys);
            }, songKeys);
            this.songKey = new MultiSelect({
                name: 'songKey',
                options: this.keys
            }, songKeys);

            var songModesContainer = domConstruct.create('div', null, keysContainer);
            domConstruct.create('label', {
                for: 'modes',
                innerHTML: 'Mode(s)'
            }, songModesContainer);
            var songModes = domConstruct.create('select', null, songModesContainer);
            this.scales.forEach(function (scale) {
                domConstruct.create('option', {
                    label: scale,
                    value: scale.toLowerCase()
                }, songModes);
            });
            this.songModes = new MultiSelect({
                name: 'modes',
                options: this.scales
            }, songModes);

            var buttonContainer = domConstruct.create('div', null, this.domNode);
            this.createNewSong = new Button({
                label: 'Add Song',
                onClick: lang.hitch(this, function (event) {
                    event.preventDefault();

                    var title = this.songName.get('value');
                    var keys = this.songKey.get('value');
                    var modes = this.songModes.get('value');

                    this.emit('newSong', {
                        title: title,
                        keys: keys,
                        modes: modes
                    });

                    this.songName.set('value', '');
                    this.songKey.set('value', '');
                    this.songModes.set('value', '');
                })
            });
            this.createNewSong.placeAt(buttonContainer);
        },

        startup: function () {
            this.inherited(arguments);

            this.songName.startup();
            this.songKey.startup();
            this.songModes.startup();
            this.createNewSong.startup();
        }
    });
});
