// Taken from underscore.js
sys = require('sys');

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
        topic           = {},
        params          = {};
    
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
    this.run = function(parameters) {
        if (parameters && typeof parameters == 'object') {
            params = parameters
        }
        
        process.on('uncaughtException', errorListener);
        process.on('exit', exitListener);

        runSetup();
    }
    
    errorListener = function(err){
        process.removeListener('uncaughtException', errorListener)
        var info = { message: err.message, type: err.type, arguments: err.arguments };
        console.error(err.stack);
        console.error(info);
        testFailed = true;
        runTeardown();
    }
    
    exitListener = function(code){
        process.removeListener('exit', exitListener);
        if(code == undefined && testFailed == true){
            process.exit(1);
        }
    }
    
    runSetup = function() { 
        if (!runSetup.topic) {
            runSetup.topic = {};
        }
        
        if (!runSetup.params) {
            runSetup.params = params;
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

        if (!runTests.params) {
            runTests.params = params;
        }
        
        // Retrieve the next function to execute
        var func = testSteps.shift();
        var result = func.apply(runTests, arguments);
    }
    
    runTeardown = function() {
        if (arguments[0]) {
            throw arguments[0];
        }
        
        if (!runTeardown.topic) {
            runTeardown.topic = runTests.topic ? extend({}, runTests.topic) : {};
        }

        if (!runTeardown.params) {
            runTeardown.params = params;
        }
        
        // Retrieve the next function to execute
        var func = teardownSteps.shift();
        if (func){
            var result = func.apply(runTeardown, arguments);
        }else{
            process.exit();
        }
    }
}

module.exports = deckard
