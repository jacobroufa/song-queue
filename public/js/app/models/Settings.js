define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/request',
    'dojo/promise/all',
    'dstore/LocalDB',
    'dstore/Memory',
    'dstore/Trackable'
], function (
    declare,
    lang,
    request,
    all,
    LocalDB,
    Memory,
    Trackable
) {
    return declare('app/models/Settings', [LocalDB, Memory, Trackable]);
});
