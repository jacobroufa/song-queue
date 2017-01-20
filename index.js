const path = require('path');
const express = require('express');

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/js/lib', express.static(path.join(__dirname, 'bower_components')));

app.listen(8008, function () {
    console.log('song-queue is being served at http://localhost:8008');
});
