define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/on',
    'dijit/_WidgetBase',
    'app/views/KeyModeSelect'
], function (
    declare,
    lang,
    domConstruct,
    on,
    _WidgetBase,
    KeyModeSelect
) {
    return declare('app/views/KeyModeSelectContainer', _WidgetBase, {
        keys: null,
        modes: null,
        value: null,
        keyModeSelects: null,

        constructor: function () {
            this.keyModeSelects = [];
        },

        buildRendering: function () {
            this.inherited(arguments);

            this.selectContainer = domConstruct.create('div', null, this.domNode);

            this._addNewSelect();

            var newSelectContainer = domConstruct.create('div', {
                className: 'addAnotherScale'
            }, this.domNode);

            this.addNewSelect = domConstruct.create('a', {
                innerHTML: 'Add another scale'
            }, newSelectContainer);
        },

        postCreate: function () {
            this.inherited(arguments);

            on(this.addNewSelect, 'click', lang.hitch(this, function (event) {
                event.preventDefault();
                this._addNewSelect();
            }));
        },

        _setValueAttr: function (value) {
            if (value === '') {
                this.keyModeSelects = [];
                domConstruct.empty(this.selectContainer);
                this._addNewSelect();
            }
        },

        _getValueAttr: function () {
            if (this.keyModeSelects.length > 0) {
                return this.keyModeSelects.map(function (select) {
                    return select.get('value');
                });
            } else {
                return '';
            }
        },

        _addNewSelect: function () {
            var index = this.keyModeSelects.length;
            var select = new KeyModeSelect({
                className: 'keyModeSelect',
                index: index,
                keys: this.keys,
                modes: this.modes
            });

            select.placeAt(this.selectContainer);
            this.keyModeSelects.push(select);

            select.startup();
        }
    });
});
