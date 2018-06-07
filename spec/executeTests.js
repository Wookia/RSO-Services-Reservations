"use strict";

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
jasmine.loadConfigFile();

jasmine.onComplete(function(){
    console.log("Jasmine Complete - Callback");  
    process.exit();  // Do this otherwise we may hang running tests
});

jasmine.execute();