function test() {
    var setupSteps      = [],
        testSteps       = [],
        teardownSteps   = [];
    
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
        if (arguments[0]) {
            throw arguments[0];
        }
        
        // If we've run out of steps then exit
        if (setupSteps.length === 0) {
            return;
        }
        
        // Retrieve the next function to execute
        var func = setupSteps.shift();
        var result = func.apply(this.runSetup, arguments);
    }
    
    runTests = function() {
        // If we've run out of steps then 
        if (testSteps.length === 0) {
            if (arguments[0]) {
                throw arguments[0];
            }
            return;
        }
        
        // Retrieve the next function to execute
        var func = testSteps.shift();
        try {
            var result = func.apply(this.runTests, arguments);
        } catch (e) {
            console.log(e);
        }
    }
    
    runTeardown = function() {
        if (arguments[0]) {
            throw arguments[0];
        }
        
        if (teardownSteps.length === 0) {
            return;
        }
        
        // Retrieve the next function to execute
        var func = teardownSteps.shift();
        var result = func.apply(this.runTeardown, arguments);
    }
    
    this.run = function() {
        runSetup();
        runTests();
        runTeardown();
    }
}

module.exports = test
