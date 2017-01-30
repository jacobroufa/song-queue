define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dijit/_WidgetBase',
    'dijit/layout/AccordionContainer',
    'dijit/layout/ContentPane',
    'dijit/form/Button'
], function (
    declare,
    lang,
    domConstruct,
    _WidgetBase,
    AccordionContainer,
    ContentPane,
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
                innerHTML: this.title
            }, this.domNode);

            var div = domConstruct.create('div', {}, this.domNode);

            this.scalesContainer = new AccordionContainer({}, div);

            Object.keys(this.scales).forEach(lang.hitch(this, function (scaleName) {
                var scale = this.scales[scaleName];

                this.scalesContainer.addChild(new ContentPane({
                    className: 'scale',
                    title: scaleName,
                    content: scale.reduce(function (returnScale, note) {
                        return returnScale + note + ' ';
                    }, '')
                }));
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

            this.scalesContainer.startup();
            this.songDeleteButton.startup();
        }
    });
});
