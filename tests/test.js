var assert = require('assert');
var deckard = require('../lib/deckard')

var t = new deckard
t.setup(
    function() {
        console.log('Running setup');
        this(null, true);
    },
    function(err, finished) {
        if (finished) {
            console.log('Finished setup')
            this();
        }
    }
).tests(
    function() {
        assert.equal(1, 1);
        this(null, 'test 2');
    },
    function(err, msg) {
        console.log(msg);
        this();
    },
    function() {
        var self = this;
        setTimeout(function(){
            assert.notEqual(1, 2);
            self();
        }, 2000)
    }
).teardown(
    function() {
        console.log('I have nothing to do :(')
        this()
    }
).run()
