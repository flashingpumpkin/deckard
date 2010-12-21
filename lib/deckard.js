// Taken from underscore.js
extend = function(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        for (var prop in source) obj[prop] = source[prop];
    });
    return obj;
};

function deckard() {
    var setupSteps      = [],
        testSteps       = [],
        teardownSteps   = [],
        // Boolean that allows us to exit correctly (i.e. `return 1` if a test fails)
        testFailed      = false,
        // `deckard` assumes both `setup` and `teardown` will work so they will
        // both fail fast. We don't really want that to happen with the tests
        // so this is a simple way to tell if we're running a test
        currentlyRunningTests = false,
        topic           = {};
    
    // # Public methods
    // Some simple methods to parse the passed in functions for `setup`, `tests`
    // and `teardown`
    this.setup = function() {
        setupSteps = Array.prototype.slice.call(arguments);
        return this;
    }
    
    this.tests = function() {
        testSteps = Array.prototype.slice.call(arguments);
        return this;
    }
    
    this.teardown = function() {
        teardownSteps = Array.prototype.slice.call(arguments);
        return this;
    }
    
    // Kick starts the test
    this.run = function() {
        // Removed process.on('uncaughtException') because it was sucky
        // Need to use `node-arse` to implement non-throwy assertions
        process.on('uncaughtException', function (err) {
            console.log(err);
            runTeardown();
        });
        runSetup();
    }
    
    runSetup = function() {
        currentlyRunningTests = false;
        
        if (!runSetup.topic) {
            runSetup.topic = {}
        }
        
        if (arguments[0]) {
            throw arguments[0];
        }
        
        // If we've run out of steps then run the tests!
        if (setupSteps.length === 0) {
            return runTests();
        }
        
        // Retrieve the next function to execute
        var func = setupSteps.shift();
        var result = func.apply(runSetup, arguments);
    }
    
    runTests = function() {
        currentlyRunningTests = true;
        
        // If we've run out of steps then run the teardown!
        if (testSteps.length === 0) {
            if (arguments[0]) {
                throw arguments[0];
            }
            return runTeardown();
        }
        
        if (!runTests.topic) {
            runTests.topic = runSetup.topic ? extend({}, runSetup.topic) : {};
        }
        
        // Retrieve the next function to execute
        var func = testSteps.shift();
        var result = func.apply(runTests, arguments);
    }
    
    runTeardown = function() {
        currentlyRunningTests = false;
        
        if (arguments[0]) {
            throw arguments[0];
        }
        
        if (teardownSteps.length === 0) {
            process.exit(testFailed ? 1 : 0);
        }
        
        if (!runTeardown.topic) {
            runTeardown.topic = runTests.topic ? extend({}, runTests.topic) : {};
        }
        
        // Retrieve the next function to execute
        var func = teardownSteps.shift();
        var result = func.apply(runTeardown, arguments);
    }
}

module.exports = deckard
