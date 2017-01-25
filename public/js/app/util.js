define([
], function (
) {
    return {
        getKeys: function () {
            return 'abcdefg'.split('').reduce(function(arr, key) {
                arr.push(key + 'b');
                arr.push(key);
                arr.push(key + '#');
                return arr;
            }, []);
        }
    };
});
