

module.exports = exceptionMode(createException()) // basically what browser this is

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
