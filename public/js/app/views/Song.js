define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dijit/_WidgetBase',
    'dijit/form/Button',
    'vex/vexflow-debug'
], function (
    declare,
    lang,
    domConstruct,
    _WidgetBase,
    Button,
    Vex
) {
    var VF = Vex.Flow;

    return declare('app/views/Song', _WidgetBase, {

        songId: null,
        title: null,
        scales: null,
        displayMode: null,

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

            // TODO: break this iterator out into its own view
            Object.keys(this.scales).forEach(lang.hitch(this, function (scaleName) {
                var scale = this.scales[scaleName];
                var scaleContainer = domConstruct.create('div', {
                    className: 'scale'
                }, this.scalesContainer);

                domConstruct.create('strong', {
                    innerHTML: scaleName
                }, scaleContainer);

                domConstruct.create('br', null, scaleContainer);

                domConstruct.place(this['_render' + this.displayMode](scale), scaleContainer);
            }));

            var songActions = domConstruct.create('div', {
                className: 'songActions'
            }, this.domNode);

            this.songEditButton = new Button({
                className: 'songEditButton',
                label: 'Edit Song',
                onClick: lang.hitch(this, function () {
                    this.emit('song-edit', { id: this.songId });
                })
            });
            this.songEditButton.placeAt(songActions, 'last');

            this.songDeleteButton = new Button({
                className: 'songDeleteButton',
                label: 'Delete Song',
                onClick: lang.hitch(this, function () {
                    this.emit('song-delete', { id: this.songId });
                })
            });
            this.songDeleteButton.placeAt(songActions, 'last');
        },

        startup: function () {
            this.inherited(arguments);

            this.songDeleteButton.startup();
        },

        _renderwritten: function (scale) {
            return domConstruct.create('div', {
                innerHTML: scale.reduce(function (returnScale, note) {
                    return returnScale + note + ' ';
                }, '')
            });
        },

        _renderstaff: function (scale) {
            // TODO: make clef user changeable
            var div = domConstruct.create('div', null);

            var vf = new VF.Factory({
                renderer: {
                    selector: div
                }
            });
            var score = vf.EasyScore();
            var system = vf.System();

            scale.push(scale[0]);
            scale = scale.map(function (note, index) {
                // TODO: allow user to set octave
                var mod = index === 0 ? '4/8' : '4';
                return note + mod;
            }).join(', ');

            system.addStave({
                voices: [
                    score.voice(score.notes(scale))
                ]
            }).addClef('treble');

            vf.draw();

            return div;
        },

        _rendertab: function (scale) {
            // TODO: implement guitar tab functionality
        }
    });
});
