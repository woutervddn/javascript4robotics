"use strict";

var Cylon = require('cylon');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 },
    dsscx18s: { driver: "dsscx18s" }
  },

  work: function(my) {
    every((1).second(), my.led.toggle);

    //every((1).second(), console.log("test"));

    every((.5).second(), function(){
        my.dsscx18s.testSer1(function(err, version) {return 0;});
        after((.25).seconds(), function() {
          my.dsscx18s.testSer1_b(function(err, version) {return 0;});
        });
      }
    );
  }
}).start();
