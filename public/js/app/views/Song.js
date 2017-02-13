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

                domConstruct.place(this['_render' + this.displayMode](scale.scale), scaleContainer);
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

            // TODO: figure out why we can't have more than a measure long
            // basically, because I can't figure out how to have more than a
            // single measure displayed at a time, we have to set every note
            // as an eighth note and ensure that our scale is 8 notes long...
            var endOfScale = [scale[0]];
            var notesRequired = (8 - scale.length);
            if (endOfScale.length < notesRequired) {
                endOfScale = endOfScale.concat(scale.slice(-(notesRequired - 1)).reverse());
            }

            scale = scale.concat(endOfScale).map(function (note, index) {
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
