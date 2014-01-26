`stackinfo`
========

Gets an object containing normalized stacktrace information across browsers. This uses [stacktrace.js](https://github.com/stacktracejs/stacktrace.js) to get stack traces

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

The stacktrace information is returned as a list of objects that each have the following properties:
* `function` - the name of the function that was running in the particular stack frame
* `file` - the file-path of the file in which the function was running
* `line` - the line number
* `column` - the column number

Any of these properties may be undefined if they are unavailable.


Browser Support
=========

Tested in the following browsers:
* Chrome 31
* Firefox 26
* IE 10

Todo
====

* Test more browsers
 * Particularly latest version of Opera, Opera mini, Android mobile, Safari, and Safari iOS
* Create unit tests once deadunit supports browser

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
6. If it's a code change, please add to the unit tests (at test/testDeadunit.js) to verify that your change works
7. When you're done, run the unit tests and ensure they all pass
8. Commit and push your changes
9. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

Change Log
=========

* 0.0.1
  * Initial release - supports latest versions of chrome, firefox, and ie

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT
