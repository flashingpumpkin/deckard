function test() {
    var setupSteps      = [],
        testSteps       = [],
        teardownSteps   = [],
        testFailed      = false,
        currentlyRunningTests = false;
    
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
    
    runSetup = function() {
        currentlyRunningTests = false;
        
        if (arguments[0]) {
            throw arguments[0];
        }
        
        // If we've run out of steps then exit
        if (setupSteps.length === 0) {
            return runTests();
        }
        
        // Retrieve the next function to execute
        var func = setupSteps.shift();
        var result = func.apply(this.runSetup, arguments);
    }
    
    runTests = function() {
        currentlyRunningTests = true;
        
        // If we've run out of steps then 
        if (testSteps.length === 0) {
            if (arguments[0]) {
                throw arguments[0];
            }
            return runTeardown();
        }
        
        // Retrieve the next function to execute
        var func = testSteps.shift();
        var result = func.apply(this.runTests, arguments);
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
        var result = func.apply(this.runTeardown, arguments);
    }
    
    this.run = function() {
        process.on('uncaughtException', function(err) {
            if (currentlyRunningTests) {
                testFailed = true;
                console.log(err);
                runTests();
            }
        });
        runSetup();
    }
}

module.exports = test
