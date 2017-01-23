Song Queue
----------

Run `npm install` followed by `npm start`, then visit http://localhost:8008 to view the application.

This is intended to be run as a service somewhere for my personal use at band practice.

## JSON endpoints

`/scale/:key-:mode` returns an array `scale` with the notes of the requested scale, e.g. `/scale/ab-minor-pentatonic`, if available.

`/scales` returns an array of the available scales.

`/scales/:key` returns an object of arrays with scales in the provided key for each of the available scales.

### Available scales

+ major
+ minor
+ dorian
+ major pentatonic
+ minor pentatonic
