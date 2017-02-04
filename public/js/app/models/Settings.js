define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/request',
    'dojo/promise/all',
    'dstore/LocalDB',
    'dstore/Trackable'
], function (
    declare,
    lang,
    request,
    all,
    LocalDB,
    Trackable
) {
    return declare('app/models/Settings', [LocalDB, Trackable]);
});
