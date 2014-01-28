function moar(next) {
    x(next)
}

var x = function(next) {
    var moo = gen(next)
    moo()
}

function gen(next) {
    return function() {
        next()
    }
}