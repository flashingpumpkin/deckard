function deckard() {
    var setupSteps      = [],
        testSteps       = [],
        teardownSteps   = [],
        // Boolean that allows us to exit correctly (i.e. `return 1` if a test fails)
        testFailed      = false,
        // `deckard` assumes both `setup` and `teardown` will work so they will
        // both fail fast. We don't really want that to happen with the tests
        // so this is a simple way to tell if we're running a test
        currentlyRunningTests = false;
    
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
        // This is our exception handler, w00t!
        // We can't use try/catch because isn't async fun?
        process.on('uncaughtException', function(err) {
            
            // We only want to handle errors if they were thrown by tests
            if (currentlyRunningTests) {
                testFailed = true;
                console.log(err);
                // Run the next test
                runTests();
            } else {
                // OK, if we got here then shit happened in `setup` or `teardown`
                throw err;
            }
        });
        runSetup();
    }
    
    runSetup = function() {
        currentlyRunningTests = false;
        
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
            return testFailed ? 1 : 0;
        }
        
        // Retrieve the next function to execute
        var func = teardownSteps.shift();
        var result = func.apply(runTeardown, arguments);
    }
}

module.exports = deckard
