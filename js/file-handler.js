/*
Simple object that makes reading/writing file contents easy. It is not
intended for any complicated tasks. This object should be very handy for
working with cache and config files stored in users profile directory.
TODO: Error callbacks are not implemented yet.
*/

FileHandler = function (filename, directory) {
    
    // If filename is not provided, random text file is created.
    this.filename = filename || 'untitled' + (new Date).getTime() + '.txt';
    
    // If directory is not provided, user's profile directory is used
    // you can find list of all special directories at:
    // https://developer.mozilla.org/en/Code_snippets/File_I%2F%2FO#Getting_special_files
    this.directory = directory || 'ProfD';
    
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
    this.file = FileUtils.getFile(this.directory, [this.filename]);
    
    // Create an empty file if it doesn't exist, otherwise there's a poopstorm
    // coming when trying to read/write it.
    if (!this.file.exists()) {
       this.file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);
    }

    // Callback can either be defined as an object with onSuccess and onError,
    // or it can be a single function (in this case it will be used to handle
    // both error and success).
    // If no callback is provided, an empty function will be used.
    this.parseCallback = function (callback) {
        var callbackFunction = (typeof callback == 'function') ? callback : function () {};
        var callbackObject = {
            onSuccess : callback.onSuccess || callbackFunction,
            onError : callback.onError || callbackFunction
        };
        return callbackObject;
    };

    // retrieves content of the file and sends it to the callback
    this.read = function (callback) {
        var callback = this.parseCallback(callback);
        
        Components.utils.import("resource://gre/modules/NetUtil.jsm");
        
        NetUtil.asyncFetch(this.file, function(stream, status) {
            if (Components.isSuccessCode(status)) {
                // If the file has zero length, then stream.available(),
                // then stream.avalilable() poops itself.
                try {
                    var data = NetUtil.readInputStreamToString(stream, stream.available());
                } finally {
                    callback.onSuccess(data, status);
                }
            } else {
                callback.onError(data, status);
            }
        });
    };
    
    // writes content to the file and calls callback when done
    this.write = function (content, callback) {
        var content = content || '';
        var callback = this.parseCallback(callback);

        Components.utils.import("resource://gre/modules/NetUtil.jsm");
        Components.utils.import("resource://gre/modules/FileUtils.jsm");
        
        var outputStream = FileUtils.openSafeFileOutputStream(this.file)
        var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var inputStream = converter.convertToInputStream(content);

        NetUtil.asyncCopy(inputStream, outputStream, function(status) {
            if (Components.isSuccessCode(status)) { 
                callback.onSuccess(status);
            } else {
                callback.onError(status);
            }
        });
    };
    
    return this;
}

// example

var myData = {firstname : 'Richard', lastname : 'Fridrich'};

var myFile = new FileHandler('test.json');
myFile.write(JSON.stringify(myData), function () {
    alert('I am done writing');
    myFile.read(function (data) {
        alert('I am done reading');
        alert(JSON.parse(data));
    });
});

/*
NOTE: read and write methods are asynchronous. You can (and probably will)
get into trouble when attempting to do this:
*/

var testFile = new FileHandler('test.txt');
testFile.write('something');
testFile.read(function (data) {
    // data will be probably empty, because reading is faster than writing
    alert(data); 
});