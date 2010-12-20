var assert  = require('assert');
var tester  = require('../lib/test');

var test = new tester();

test.setup(
    function() {
        console.log('Running setup');
        this(null, true);
    },
    function(finished) {
        if (finished) {
            console.log('Finished setup')
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
        assert.notEqual(1, 1);
    }
).teardown(
    function() {
        console.log('I have nothing to do :(')
    }
).run()