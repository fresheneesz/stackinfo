`stackinfo`
========

Gets an object containing normalized stacktrace information across browsers.

Example
=======

```javascript
var stackinfo = require('stackinfo')

function getInfo() {
  stackinfo()
}

var info = getInfo() // returns the info

try {
  something()
} catch(e) {
  var moreInfo = stackinfo(e) // gets a stacktrace from an exception
}
```

Install
=======

```
npm install stackinfo
```

Usage
=====

Browser Support
=========
Tested in the following browsers:
* Chrome 31
* Firefox 26
* IE 10


Todo
====

* Test more browsers

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
  * Initial release

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT
