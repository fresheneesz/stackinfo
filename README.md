`stackinfo`
========

Gets an object containing normalized stacktrace information across browsers. If you want to programmatically inspect the stack, this is the module for you. This uses [stacktrace.js](https://github.com/stacktracejs/stacktrace.js) to get stack traces.

Example
======

```javascript
var info = stackinfo()
console.log('This is line '+(info[0].line + 1))
```

Install
=======

```
npm install stackinfo
```

Usage
=====

```javascript
var stackinfo = require('stackinfo') // common js

require('node_modules/generatedBuild/stackinfo.umd.js', function(stackinfo) {/*...*/}) // require.js
```
```
<script src="node_modules/generatedBuild/stackinfo.umd.js"></script> <!-- browser global -->
```

`stackinfo([<exception>])` - returns stack trace information in the below format. If `<exception>` is passed, the stacktrace will be taken from that exception, otherwise a stacktrace will be generated for the current call. Passed exceptions doesn't work in IE or Safari 5 (this is a limitation of stacktrace.js).

##Format##

The stacktrace information is returned as a list of objects that each have getter properties that parse the stacktrace line (and cache the result). The properties are:
* `function` - the name of the function that was running in the particular stack frame
* `file` - the file-path of the file in which the function was running
* `line` - the line number
* `column` - the column number
* `info` - an object containing the above 4 properties

Any of these properties may be undefined if they are unavailable.


Browser Support
=========

Tested in the following browsers:
* Chrome 31
* Firefox 26
* IE 10

Note that stackinfo doesn't work in node.js, but if you need that, check out [node-stack-trace](https://github.com/felixge/node-stack-trace)

Todo
====

* When firefix [adds column numbers into its stack traces](https://bugzilla.mozilla.org/show_bug.cgi?id=762556), add those to stack info
* Test more browsers
 * Particularly latest version of Opera, Opera mini, Android mobile, Safari, and Safari iOS
* Create unit tests once deadunit supports browser
* Support node.js via node-stack-trace
 * Possibly also use this for chrome, since it works in chrome too

How to Contribute!
============

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes.
* Updating the documentation: ie this readme file. Be bold! Help create amazing documentation!
* Submitting pull requests.

How to submit pull requests:

1. Please create an issue and get my input before spending too much time creating a feature. Work with me to ensure your feature or addition is optimal and fits with the purpose of the project.
2. Fork the repository
3. clone your forked repo onto your machine and run `npm install` at its root
4. If you're gonna work on multiple separate things, its best to create a separate branch for each of them
5. edit!
6. If it's a code change, please add to the test file (at test/testStackinfo.js) to verify that your change works
7. When you're done, run the unit tests and ensure they all pass
8. Commit and push your changes
9. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

Change Log
=========

* 1.1.3 - upgrading tests to use deadunit and supporting new firefox stacklines that have columns now!
* 1.1.2 - Working around this stacktrace.js bug for ie 10: https://github.com/stacktracejs/stacktrace.js/issues/80
* 1.1.1 - outputting line and column numbers as Numbers instead of as Strings.
* 1.0.9 - fixing bug where the wrong stacktrace would be returned when one was passed in
* 1.0.6 - exposing stacktrace.js's sourceCache so it can be consolidated with source caches from other modules
* 1.0.4 - adding a firefox trace pattern
* 1.0.3 - adding another chrome trace pattern (event handlers)
* 1.0.2
  * adding a couple chrome trace patterns that previously didn't parse
* 1.0.0
  * BREAKING CHANGE
  * For performance reasons, a stackinfo element no longer parses the stacktrace upfront, instead it parses it once the function, file, line, or column are asked for.
  * This means that looping through the element will no longer give you the properties - you have to access them via their getters
* 0.0.4
  * adding getSource error regex for ie and firefox
* 0.0.3
  * adding regex for parsing stacktrace.js getSource error, which makes it so the file and line number can still be reported even if the function name can't be guessed
* 0.0.2
  * fixing incorrect regex which caused major performance issues
* 0.0.1
  * Initial release - supports latest versions of chrome, firefox, and ie

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT
