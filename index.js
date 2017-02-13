const path = require('path');
const express = require('express');
const scale = require('tonal-scale');

// we are going to support these scales only, for now...
const modes = {
    'major': 1,
    'lydian': 4,
    'mixolydian': 5,
    'minor': 6
};

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
    const pentatonic = req.query.pentatonic;
    const keyScale = scale.get(mode, key);
    const keyModes = Object.keys(modes);
    const major = mode === 'major' ? keyScale : scale.get('major', keyScale[8 - modes[mode]]);
    const result = {};

    result[key] = {
        scale: keyScale,
        related: []
    };

    keyModes.splice(keyModes.indexOf(mode), 1);

    log('/scale/' + scaleName);

    if (pentatonic) {
        result[key].related.push({
            'pentatonic': scale.get(mode + ' pentatonic', key)
        });
    }

    keyModes.forEach((name) => {
        const keyModeKey = major[modes[name] - 1].toLowerCase();
        const scaleObj = {};

        scaleObj[keyModeKey + ' ' + name] = scale.get(name, keyModeKey);

        result[key].related.push(scaleObj);
    });

    res.json(result);
});

app.get('/scales', (req, res) => {
    const keyModes = Object.keys(modes);

    log('/scales');

    res.json({
        scales: keyModes
    });
});

app.get('/scales/:key', (req, res) => {
    const key = req.params.key;
    const keyModes = Object.keys(modes);
    const scales = {};

    log('/scales/' + key);

    keyModes.forEach((mode) => {
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
