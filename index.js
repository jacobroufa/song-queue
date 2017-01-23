const path = require('path');
const express = require('express');
const scale = require('tonal-scale');

// we are going to support these scales only, for now...
const modes = ['major', 'minor', 'dorian', 'major pentatonic', 'minor pentatonic'];

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/js/lib', express.static(path.join(__dirname, 'bower_components')));

app.get('/scale/:key-:mode', (req, res) => {
    const key = req.params.key;
    const mode = req.params.mode.replace('-', ' ');

    res.json({
        scale: scale.get(mode, key)
    });
});

app.get('/scales', (req, res) => {
    res.json({
        scales: modes
    });
});

app.get('/scales/:key', (req, res) => {
    const key = req.params.key;
    const scales = {};

    modes.forEach((mode) => {
        scales[mode] = scale.get(mode, key);
    });

    res.json({
        scales: scales
    });
});

app.listen(8008, () => {
    console.log('song-queue is being served at http://localhost:8008');
});
