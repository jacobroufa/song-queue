define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/layout/ContentPane',
    'dijit/form/TextBox',
    'dijit/form/MultiSelect',
    'dijit/form/Button'
], function (
    declare,
    lang,
    ContentPane,
    TextBox,
    MultiSelect,
    Button
) {
    return declare('app/views/SongForm', ContentPane, {
        scales: null,

        buildRendering: function () {
            this.inherited(arguments);

            this.songName = new TextBox({
                name: 'title',
                placeHolder: 'Song title'
            });
            this.songKey = new TextBox({
                name: 'key',
                placeHolder: 'Song key'
            });
            this.songModes = new MultiSelect({
                label: 'Mode(s)',
                options: this.scales
            });
            this.createNewSong = new Button({
                label: 'Add Song',
                onClick: function (event) {
                    event.preventDefault();
                }
            });

            this.songName.placeAt(this.domNode, 'last');
            this.songKey.placeAt(this.domNode, 'last');
            this.songModes.placeAt(this.domNode, 'last');
            this.createNewSong.placeAt(this.domNode, 'last');
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
