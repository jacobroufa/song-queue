define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dijit/_WidgetBase',
    'dijit/form/Button'
], function (
    declare,
    lang,
    domConstruct,
    _WidgetBase,
    Button
) {
    return declare('app/views/Song', _WidgetBase, {

        songId: null,
        title: null,
        scales: null,

        buildRendering: function () {
            this.inherited(arguments);

            console.log(this.songId, this.title, this.scales);

            domConstruct.create('h3', {
                className: 'songTitle',
                innerHTML: this.title
            }, this.domNode);

            this.scalesContainer = domConstruct.create('div', {
                className: 'scalesContainer'
            }, this.domNode);

            Object.keys(this.scales).forEach(lang.hitch(this, function (scaleName) {
                var scale = this.scales[scaleName];
                var scaleContainer = domConstruct.create('div', {
                    className: 'scale'
                }, this.scalesContainer);

                domConstruct.create('strong', {
                    innerHTML: scaleName
                }, scaleContainer);
                domConstruct.create('br', null, scaleContainer);

                domConstruct.create('p', {
                    innerHTML: scale.reduce(function (returnScale, note) {
                        return returnScale + note + ' ';
                    }, '')
                }, scaleContainer);
            }));

            this.songDeleteButton = new Button({
                className: 'songDeleteButton',
                label: 'Delete Song',
                onClick: lang.hitch(this, function () {
                    this.emit('song-delete', { id: this.songId });
                })
            });
            this.songDeleteButton.placeAt(this.domNode, 'last');
        },

        startup: function () {
            this.inherited(arguments);

            this.songDeleteButton.startup();
        }
    });
});
