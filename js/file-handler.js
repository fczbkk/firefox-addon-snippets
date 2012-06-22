/*
Simple object that makes reading/writing file contents easy. It is not
intended for any complicated tasks. This object should be very handy for
working with cache and config files stored in users profile directory.
TODO: Error callbacks are not implemented yet.
*/

FileHandler = function (filename, directory) {
    
    // if filename is not provided, random text file is created
    this.filename = filename || 'untitled' + (new Date).getTime() + '.txt';
    
    // if directory is not provided, user's profile directory is used
    // you can find list of all special directories at:
    // https://developer.mozilla.org/en/Code_snippets/File_I%2F%2FO#Getting_special_files
    this.directory = directory || 'ProfD';
    
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
    this.file = FileUtils.getFile(this.directory, [this.filename]);
    
    // retrieves content of the file and sends it to the callback
    this.read = function (callback) {
        var callback = callback || function () {};
        
        Components.utils.import("resource://gre/modules/NetUtil.jsm");
        
        NetUtil.asyncFetch(this.file, function(stream, status) {
            if (Components.isSuccessCode(status)) {
                var data = NetUtil.readInputStreamToString(stream, stream.available());
                callback(data);
            } else {
                // TODO handle error
            }
        });
    };
    
    // writes content to the file and calls callback when done
    this.write = function (content, callback) {
        var content = content || '';
        var callback = callback || function () {};

        Components.utils.import("resource://gre/modules/NetUtil.jsm");
        Components.utils.import("resource://gre/modules/FileUtils.jsm");
        
        var outputStream = FileUtils.openSafeFileOutputStream(this.file)
        var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var inputStream = converter.convertToInputStream(content);

        NetUtil.asyncCopy(inputStream, outputStream, function(status) {
            if (Components.isSuccessCode(status)) { 
                callback();
            } else {
                // TODO handle error
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