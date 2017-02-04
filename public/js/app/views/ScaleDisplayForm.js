define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/Evented',
    'dijit/layout/ContentPane',
    'dijit/form/Button',
    'dijit/form/Select'
], function (
    declare,
    lang,
    domConstruct,
    Evented,
    ContentPane,
    Button,
    Select
) {
    return declare('app/views/ScaleDisplayForm', [ContentPane, Evented], {
        buildRendering: function () {
            this.inherited(arguments);

            var settingContainer = domConstruct.create('div', null, this.domNode);
            var buttonContainer = domConstruct.create('div', null, this.domNode);

            this.scaleDisplaySelect = new Select({
                name: 'scaleDisplayMenu',
                options: [
                    { label: 'Written Notes', value: 'written', selected: true },
                    { label: 'Notated on a Staff', value: 'staff' },
                    { label: 'Notated for Guitar', value: 'tab' }
                ]
            });
            this.scaleDisplaySelect.placeAt(settingContainer);

            this.saveSettings = new Button({
                label: 'Save Settings',
                onClick: lang.hitch(this, function (event) {
                    event.preventDefault();

                    var scaleDisplay = this.scaleDisplaySelect.get('value');

                    this.emit('settingsSave', {
                        displayMode: scaleDisplay
                    });
                })
            });
            this.saveSettings.placeAt(buttonContainer);
        },

        startup: function () {
            this.inherited(arguments);

            this.scaleDisplaySelect.startup();
            this.saveSettings.startup();
        }
    });
});
