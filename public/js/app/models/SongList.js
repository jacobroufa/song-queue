define([
    'dojo/_base/declare',
    'dojo/request',
    'dojo/promise/all',
    'dstore/LocalDB',
    'dstore/Trackable'
], function (
    declare,
    request,
    all,
    LocalDB,
    Trackable
) {
    return declare('app/models/SongList', [LocalDB, Trackable], {
        add: function (modelToAdd) {
            var self = this;
            var oldargs = arguments;
            var scales = [];

            modelToAdd.keys.forEach(function (key) {
                modelToAdd.modes.forEach(function (mode) {
                    scales.push(request('/scale/' + key + '-' + mode, { handleAs: 'json' }));
                });
            });

            return all(scales).then(function (data) {
                var scalesObj = data.reduce(function (obj, scale) {
                    var scalesInObj = Object.keys(scale);

                    scalesInObj.forEach(function (key) {
                        obj[key] = scale[key];
                    });

                    return obj;
                }, {});

                oldargs[0] = {
                    title: modelToAdd.title,
                    scales: scalesObj
                };

                return self.inherited(oldargs);
            });
        }
    });
});

