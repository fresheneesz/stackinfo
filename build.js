var fs = require('fs')
var build = require('build-modules')


var name = 'stackinfo'

var buildDirectory = __dirname+'/generatedBuild/'
if(!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory)
}

console.log('building and minifying...')
build(buildDirectory, name, '/*Copyright 2014 Billy Tetrud - MIT license, free for any use*/',
    __dirname+"/"+name+".js",
    function(e) {
        if(e === undefined) {
            console.log('done building browser package')
        } else {
            console.log(e.stack)
            process.exit(1)
        }
})
