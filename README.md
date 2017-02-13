Song Queue
----------

![Song Queue screenshot](/screenshot.png)

After cloning the repository you should run `npm install`, followed by `npm start`. You should now be able to visit http://localhost:8008 to view the application.

This is intended to be run as a service somewhere for my personal use at band practice.

## JSON endpoints

`/keys` returns an array of all the possible keys, including sharp and flat keys.

`/scale/:key-:mode` returns an object with a single property named for the key, with two properties: `scale` and `related`. `scale` contains the notes of the requested scale, e.g. `/scale/ab-minor`, if available. `related` is an array of related scales in other modes. If a `pentatonic` query string with any truthy value is appended to the URL, the corresponding pentatonic scale is also returned in the `related` array.

`/scales` returns an array of the available scales.

`/scales/:key` returns an object of arrays with scales in the provided key for each of the available scales.

### Available scales

+ major
+ lydian
+ mixolydian
+ minor
+ pentatonic
