var printStackTrace = require('stacktrace-js')

module.exports = function(ex) {
    var trace = printStackTrace(ex)

    if(ex !== undefined) {
        trace.splice(0,4) // strip stacktrace-js internals
    }

    var modeException = ex || createException()

    var mode = exceptionMode(modeException)
    return parseStacktrace(mode, trace)
}

function parseStacktrace(mode, trace) {
    if(parsers[mode] === undefined) 
        throw new Error("browser "+mode+" not supported")
    
    var results = []
    for(var n = 0; n<trace.length; n++) {
        results.push(parsers[mode](trace[n]))
    }
    return results
}

// verbatim from `mode` in stacktrace.js as of 2014-01-23
function exceptionMode(e) {
    if (e['arguments'] && e.stack) {
        return 'chrome';
    } else if (e.stack && e.sourceURL) {
        return 'safari';
    } else if (e.stack && e.number) {
        return 'ie';
    } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
        // e.message.indexOf("Backtrace:") > -1 -> opera
        // !e.stacktrace -> opera
        if (!e.stacktrace) {
            return 'opera9'; // use e.message
        }
        // 'opera#sourceloc' in e -> opera9, opera10a
        if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
            return 'opera9'; // use e.message
        }
        // e.stacktrace && !e.stack -> opera10a
        if (!e.stack) {
            return 'opera10a'; // use e.stacktrace
        }
        // e.stacktrace && e.stack -> opera10b
        if (e.stacktrace.indexOf("called from line") < 0) {
            return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
        }
        // e.stacktrace && e.stack -> opera11
        return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
    } else if (e.stack && !e.fileName) {
        // Chrome 27 does not have e.arguments as earlier versions,
        // but still does not have e.fileName as Firefox
        return 'chrome';
    } else if (e.stack) {
        return 'firefox';
    }
    return 'other';
}

function createException() {
    try {
        this.undef();
    } catch (e) {
        return e;
    }
}

var parsers = {
    chrome: function(line) {
        var m = line.match(CHROME_STACK_LINE);
        if (m) {
            var file = m[5] || m[12] || m[19]
            var fn = m[2] || m[9] || m[16]
            var lineNumber = m[7] || m[14]
            var column = m[8] || m[15]
        } else {
            //throw new Error("Couldn't parse exception line: "+line)
        }
        
        return {
            file: file,
            function: fn,
            line: lineNumber,
            column: column
        }
    },
    
    firefox: function(line) {
        var m = line.match(FIREFOX_STACK_LINE);
        if (m) {
            var file = m[6]
            var fn = m[1]
            var lineNumber = m[8]
        }
        
        return {
            file: file,
            function: fn,
            line: lineNumber
        }
    },
    
    ie: function(line) {
        var m = line.match(IE_STACK_LINE);
        if (m) {
            var file = m[3] || m[8]
            var fn = m[2] || m[8]
            var lineNumber = m[5] || m[11]
            var column = m[6] || m[12]
        }
        
        return {
            file: file,
            function: fn,
            line: lineNumber,
            column: column
        }
    }
}



// The following 2 regex patterns were originally taken from google closure library: https://code.google.com/p/closure-library/source/browse/closure/goog/testing/stacktrace.js
// RegExp pattern for JavaScript identifiers. We don't support Unicode identifiers defined in ECMAScript v3.
var IDENTIFIER_PATTERN_ = '[a-zA-Z_$][\\w$]*';
// RegExp pattern for an URL + position inside the file.
var URL_PATTERN_ = '((?:http|https|file)://[^\\s)]+|javascript:.*)';


var CHROME_FILE_AND_LINE = URL_PATTERN_+'(:(\\d*):(\\d*))'
var CHROME_COMPOUND_IDENTIFIER = "((new )?"+IDENTIFIER_PATTERN_+'(\\.'+IDENTIFIER_PATTERN_+')*)'

// output from stacktrace.js is: "name()@..." instead of "name (...)"
var CHROME_ANONYMOUS_FUNCTION = CHROME_COMPOUND_IDENTIFIER+'\\(\\)'+'@'+CHROME_FILE_AND_LINE
var CHROME_NORMAL_FUNCTION = CHROME_COMPOUND_IDENTIFIER+' \\('+CHROME_FILE_AND_LINE+'\\)'
var CHROME_NATIVE_FUNCTION = CHROME_COMPOUND_IDENTIFIER+' (\\(native\\))'

var CHROME_FUNCTION_CALL = '('+CHROME_ANONYMOUS_FUNCTION+"|"+CHROME_NORMAL_FUNCTION+"|"+CHROME_NATIVE_FUNCTION+')'

var CHROME_STACK_LINE = new RegExp('^'+CHROME_FUNCTION_CALL+'$')  // precompile them so its faster


var FIREFOX_FILE_AND_LINE = URL_PATTERN_+'(:(\\d*))'
var FIREFOX_COMPOUND_IDENTIFIER = '('+IDENTIFIER_PATTERN_+'((\\(\\))?|(\\.|\\<|/)*))*'
var FIREFOX_FUNCTION_CALL = '('+FIREFOX_COMPOUND_IDENTIFIER+')@'+FIREFOX_FILE_AND_LINE
var FIREFOX_STACK_LINE = new RegExp('^'+FIREFOX_FUNCTION_CALL+'$')

var IE_WHITESPACE = '[\\w \\t]'
var IE_FILE_AND_LINE = CHROME_FILE_AND_LINE
var IE_ANONYMOUS = '('+IE_WHITESPACE+'*({anonymous}\\(\\)))@\\('+IE_FILE_AND_LINE+'\\)'
var IE_NORMAL_FUNCTION = '('+IDENTIFIER_PATTERN_+')@'+IE_FILE_AND_LINE
var IE_FUNCTION_CALL = '('+IE_NORMAL_FUNCTION+'|'+IE_ANONYMOUS+')'+IE_WHITESPACE+'*'
var IE_STACK_LINE = new RegExp('^'+IE_FUNCTION_CALL+'$')

module.exports.chrome = CHROME_STACK_LINE