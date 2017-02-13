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
        put: function (model) {
            var self = this;
            var oldargs = arguments;

            return this._update(model).then(function (updatedModel) {
                oldargs[0] = updatedModel;

                return self.inherited(oldargs);
            });
        },
        _update: function (model) {
            var scales = [];

            model.keys.forEach(function (key) {
                var encodedKey = encodeURIComponent(key.key);
                scales.push(request('/scale/' + encodedKey + '-' + key.mode, { handleAs: 'json' }));
            });

            return all(scales).then(function (data) {
                var scalesObj = data.reduce(function (obj, scale) {
                    var scalesInObj = Object.keys(scale);

                    scalesInObj.forEach(function (key) {
                        obj[key] = scale[key];
                    });

                    return obj;
                }, {});
                var updatedModel = {
                    title: model.title,
                    scales: scalesObj
                };

                if (model.id) {
                    updatedModel.id = model.id;
                }

                return updatedModel;
            });
        }
    });
});
