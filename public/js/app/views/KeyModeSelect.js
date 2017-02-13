define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/topic',
    'dijit/_WidgetBase',
    'dijit/form/Select'
], function (
    declare,
    lang,
    domConstruct,
    on,
    topic,
    _WidgetBase,
    Select
) {
    return declare('app/views/KeyModeSelect', _WidgetBase, {
        index: null,
        keys: null,
        initialKey: null,
        modes: null,
        initialMode: null,
        value: null,
        selectIndex: null,

        buildRendering: function () {
            this.inherited(arguments);

            var div = domConstruct.create('div', null, this.domNode);
            var keyName = 'key_' + this.index;
            var modeName = 'mode_' + this.index;
            var keyOptions = this.keys.map(lang.hitch(this, function (key, idx) {
                var option = {
                    label: key,
                    value: key
                };

                if (idx === 0) {
                    option['selected'] = true;
                    this.initialKey = key;
                }

                return option;
            }));
            var modeOptions = this.modes.map(lang.hitch(this, function (mode, idx) {
                var option = {
                    label: mode,
                    value: mode
                };

                if (idx === 0) {
                    option['selected'] = true;
                    this.initialMode = mode;
                }

                return option;
            }));

            domConstruct.create('label', {
                innerHTML: 'Key',
                for: keyName
            }, div);
            this.keySelect = new Select({
                name: keyName,
                options: keyOptions
            });
            this.keySelect.placeAt(div);

            domConstruct.create('br', null, div);

            domConstruct.create('label', {
                innerHTML: 'Mode',
                for: modeName
            }, div);
            this.modeSelect = new Select({
                name: modeName,
                options: modeOptions
            });
            this.modeSelect.placeAt(div);

            if (this.index > 0) {
                var removeLink = domConstruct.create('a', {
                    className: 'removeScale',
                    innerHTML: 'Remove scale'
                }, div);
                on(removeLink, 'click', lang.hitch(this, function (event) {
                    event.preventDefault();
                    topic.publish('removeScale', { index: this.index });
                }));
            }
        },

        startup: function () {
            this.inherited(arguments);

            this.keySelect.startup();
            this.modeSelect.startup();
        },

        _setValueAttr: function (value) {
            if (value === '') {
                this.keySelect.set('value', this.initialKey);
                this.modeSelect.set('value', this.initialMode);
            } else if (lang.isArray(value)) {
                this.keySelect.set('value', value[0]);
                this.modeSelect.set('value', value[1]);
            }
        },

        _getValueAttr: function () {
            return {
                key: this.keySelect.get('value'),
                mode: this.modeSelect.get('value')
            };
        }
    });
});
