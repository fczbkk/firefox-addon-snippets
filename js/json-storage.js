/*
NOTE: This object requires FileHandler object to work. Get it at:
https://github.com/fczbkk/firefox-addon-snippeets/blob/master/js/file-handler.js

Provides simple interface for storing JSON data on filesystem. This comes
handy when you need to remember lots of serialized data that won't fit the
preferences and you can not use the localStorage, because it is not available
in browser's global scope.

The .get and .set methods are asynchronous. If you're going to write something
and then read it immediately, it probably won't work as intended. That's
because reading is faster than writing. Use callbacks, instead of procedural
code.
*/

JsonStorage = function (id, defaultData) {

    // If no ID is provided, then a random one will be generated. The problem
    // is, that you will have to remember it somehow, if you want to access
    // the data again.
    this.id = id || 'untitled' + (new Date).getTime();
    
    // ID will be used as a filename. The file will be stored in user's
    // preferences folder.
    this.filename = this.id + '.json';
    
    // You can provide default data set, which will be used when the data
    // file is created.
    this.defaultData = defaultData || {};
    
    // This requires FileHandler object. See note at the top of this file.
    this.file = new FileHandler(this.filename);
    
    // Gets all the data, parses them into JSON object and feeds them into
    // the callback function.
    this.get = function (callback) {
        var callback = callback || function () {};
        var onReadCallback = function (response) {
            var data = response ? JSON.parse(response) : this.defaultData;
            callback(data);
        };
        this.file.read(onReadCallback.bind(this));
    };
    
    // Takes the data, serializes them and saves them to the file. Overwrites
    // everything that was there before, so be cautious.
    this.set = function (data, callback) {
        var data = data || this.defaultData;
        var content = JSON.stringify(data);
        this.file.write(content, callback);
    }
    
    return this;
}

// How to use it:

// Data will be stored in user's profile dictionary under name
// 'my-config.json'. It will contain variable 'numbers' containing set of
// random numbers.
var myConfig = new JsonStorage('my-config', {numbers : [4, 8, 15, 16, 23, 42]});

// Now let's read the data, announce winning numbers. Then let's generate
// new random number, add it to the list and save new data.
myConfig.read(function (data) {
    alert('winning numbers are: ' + data.numbers);
    var randomNumber = Math.round(Math.random()*100);
    alert('new winning number is: ' + randomNumber);
    data.numbers.push(randomNumber);
    myConfig.write(data);
});