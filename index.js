const path = require('path');
const express = require('express');
const scale = require('tonal-scale');

// we are going to support these scales only, for now...
const modes = ['major', 'minor', 'dorian', 'major pentatonic', 'minor pentatonic'];

const app = express();

const log = function (path) {
    console.log(new Date().toString(), 'serving ' + path);
};

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/js/lib', express.static(path.join(__dirname, 'bower_components')));
app.use('/js/lib/vexflow', express.static(path.join(__dirname, 'node_modules/vexflow/releases')));

app.get('/scale/:key-:mode', (req, res) => {
    const key = req.params.key;
    const mode = req.params.mode.replace('-', ' ');
    const scaleName = key + '-' + mode;
    const result = {};

    if (mode.split(' ').length === 1
        && mode === 'major' || mode === 'minor') {
        const pentatonic = mode + ' pentatonic';
        result[pentatonic] = scale.get(pentatonic, key);
    }

    log('/scale/' + scaleName);

    result[mode] = scale.get(mode, key);

    res.json(result);
});

app.get('/scales', (req, res) => {
    log('/scales');

    res.json({
        scales: modes
    });
});

app.get('/scales/:key', (req, res) => {
    const key = req.params.key;
    const scales = {};

    log('/scales/' + key);

    modes.forEach((mode) => {
        scales[mode] = scale.get(mode, key);
    });

    res.json({
        scales: scales
    });
});

app.get('/keys', (req, res) => {
    const baseKeys = 'abcdefg'.split('')
    const keys = baseKeys.reduce((arr, key) => {
        arr.push(key + 'b');
        arr.push(key);
        arr.push(key + '#');
        return arr;
    }, []);

    log('/keys');

    res.json({
        keys: keys
    });
});

app.listen(8008, () => {
    console.log(new Date().toString(), 'song-queue is being served at http://localhost:8008');
});
