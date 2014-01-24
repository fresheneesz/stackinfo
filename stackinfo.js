var printStackTrace = require('stacktrace-js')

module.exports = function(ex) {
    var trace = printStackTrace(ex)

    // strip stacktrace-js internals
    trace.splice(0,4)

    var modeException = ex || createException()

    var mode = exceptionMode(modeException)
    return parseStacktrace(mode, trace)
}

function parseStacktrace(mode, trace) {
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
            return {
                   
            }
        } else {
            throw new Error("Couldn't parse exception line: "+line)
        }
    }

}



// The following regex patterns were originally taken from google closure library: https://code.google.com/p/closure-library/source/browse/closure/goog/testing/stacktrace.js

// RegExp pattern for JavaScript identifiers. We don't support Unicode identifiers defined in ECMAScript v3.
var IDENTIFIER_PATTERN_ = '[a-zA-Z_$][\\w$]*';

// RegExp pattern for function name alias in the Chrome stack trace.
var CHROME_ALIAS_PATTERN_ =
    '(?: \\[as (' + IDENTIFIER_PATTERN_ + ')\\])?';


// RegExp pattern for function names and constructor calls in the Chrome stack trace.
var CHROME_FUNCTION_NAME_PATTERN_ =
    '(?:new )?(?:' + IDENTIFIER_PATTERN_ +
    '|<anonymous>)';


// RegExp pattern for function call in the Chrome stack trace.
// Creates 3 submatches with context object (optional), function name and function alias (optional).
var CHROME_FUNCTION_CALL_PATTERN_ =
    ' (?:(.*?)\\.)?(' + CHROME_FUNCTION_NAME_PATTERN_ +
    ')' + CHROME_ALIAS_PATTERN_;


// RegExp pattern for an URL + position inside the file.
var URL_PATTERN_ =
    '((?:http|https|file)://[^\\s)]+|javascript:.*)';


// RegExp pattern for an URL + line number + column number in Chrome.
// The URL is either in submatch 1 or submatch 2.
var CHROME_URL_PATTERN_ = ' (?:' +
    '\\(unknown source\\)' + '|' +
    '\\(native\\)' + '|' +
    '\\((?:eval at )?' + URL_PATTERN_ + '\\)' + '|' +
    URL_PATTERN_ + ')';

var CHROME_STACK_LINE_original = '(?:' + CHROME_FUNCTION_CALL_PATTERN_ + ')?' + CHROME_URL_PATTERN_ + '$';

// Regular expression for parsing one stack frame in Chrome.
var CHROME_STACK_FRAME_REGEXP_ = new RegExp('^    at' + CHROME_STACK_LINE_original);



var CHROME_FILE_AND_LINE = URL_PATTERN_+'(:(\\d*):(\\d*))'
var CHROME_COMPOUND_IDENTIFIER = "((new )?"+IDENTIFIER_PATTERN_+'(\.'+IDENTIFIER_PATTERN_+')*)'

// output from stacktrace.js is: "name()@..." instead of "name (...)"
var CHROME_ANONYMOUS_FUNCTION = CHROME_COMPOUND_IDENTIFIER+'\\(\\)'+'@'+CHROME_FILE_AND_LINE
var CHROME_NORMAL_FUNCTION = CHROME_COMPOUND_IDENTIFIER+' \\('+CHROME_FILE_AND_LINE+'\\)'
var CHROME_NATIVE_FUNCTION = CHROME_COMPOUND_IDENTIFIER+' \\(native\\)'

var CHROME_FUNCTION_CALL = '('+CHROME_ANONYMOUS_FUNCTION+"|"+CHROME_NORMAL_FUNCTION+"|"+CHROME_NATIVE_FUNCTION+')'

var CHROME_STACK_LINE = '^'+CHROME_FUNCTION_CALL+'$'

var nothing = 3
