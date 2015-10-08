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
    var servoBoard = my.dsscx18s;
    every((1).second(), my.led.toggle);
    init_servos(my.dsscx18s);
    var interval = 3;

    after((1.5).seconds(), function() {
      //do stuff
      straight_up(my.dsscx18s, false);
      //actuate_servo(my.dsscx18s, 4, 255);
    });
    after((5+interval).seconds(), function() {
      //do stuff
      actuate_servo(servoBoard, 1, 153);
      actuate_servo(servoBoard, 2, 120);
      actuate_servo(servoBoard, 3, 150);
    });
    after((7+interval).seconds(), function() {
      //do stuff
      actuate_servo(servoBoard, 1, 170);
      actuate_servo(servoBoard, 2, 160);
      actuate_servo(servoBoard, 3, 170);
    });
    after((10+interval).seconds(), function() {
      //do stuff
      actuate_servo(servoBoard, 1, 200);
      actuate_servo(servoBoard, 2, 230);
      actuate_servo(servoBoard, 3, 200);
    });
    after((12+interval).seconds(), function() {
      //do stuff
      actuate_servo(servoBoard, 4, 30);
    });
    after((15+interval).seconds(), function() {
      //do stuff
      actuate_servo(servoBoard, 4, 200);
    });
    after((18+interval).seconds(), function() {
      stop_pos(my.dsscx18s);
    });
  }
}).start();

var SERVO_BEGIN_POSITIONS = [245,245,235,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //All servo's on 0;
var servoPositions = [];
var MAX_DEGREES_PER_SECOND = 180;
var SERVOS_IN_USE = 4

var actuate_servo = function(servoBoard, servoPin, newPosition){
  var actuate = true;
  var callback = function(){return 0;};

  var oldPosition = servoPositions[ ((servoPin-1)) ];
  var steps = newPosition > oldPosition ? Math.ceil( (( (newPosition-oldPosition)/ MAX_DEGREES_PER_SECOND )) ) : Math.ceil( (( (oldPosition-newPosition)/ MAX_DEGREES_PER_SECOND )) );
  var steps = 100*steps; //interpolation
  var doOnce = true;

  console.log("Actuating servo "+ servoPin +" in " + steps + " steps.");

  var index = 0;
  every((.01).second(), function(){
    var newFrame = index+1;
    if( newFrame <= steps){
      var startPos = oldPosition;
      var changeInVal = ((newPosition - oldPosition));
      var intermediatePosition = Math.easeInOutCubic(newFrame, startPos, changeInVal, steps );
      
      console.log("Step "+ newFrame +" going to position "+ intermediatePosition);
      servoBoard.servo_go_to_pos(servoPin, intermediatePosition, actuate, callback);

      index++;
    } else if(doOnce == true) {
      doOnce = false;
      servoPositions[ ((servoPin-1)) ] = newPosition;
    }
  });
}


/* POSITION FUNCTIONS */
var init_servos = function(servoBoard){
  for (var i = 0; i < SERVO_BEGIN_POSITIONS.length; ++i) {
    var callback = function(){ return 0; }
    servoBoard.servo_go_to_pos(i+1, SERVO_BEGIN_POSITIONS[i], true, callback);
    servoPositions[i] = SERVO_BEGIN_POSITIONS[i];
    console.log("servo " + i + " set to position 0");
  }
}

var straight_up = function(servoBoard, rotate){
  if (typeof rotate === 'undefined') { rotate = false; }
  
  actuate_servo(servoBoard, 1, 130);
  actuate_servo(servoBoard, 2, 75);
  actuate_servo(servoBoard, 3, 125);
  
  if(rotate){
    actuate_servo(servoBoard, 4, 128);
  }
}

var stop_pos = function(servoBoard){
  console.log("going to stop position...")
  for(var i = 0; i<SERVOS_IN_USE; i++){
    actuate_servo(servoBoard, ((i+1)) , SERVO_BEGIN_POSITIONS[i] );
  }
}





/* HELPER FUNCTIONS */

/**
 * MATH EASING
 *
 * t: current time - should here be values 0...1, or real number of the current frame?
 * b: start value - I assume, a start X or Y coordinate of the object being moved
 * c: change in value - can here be number 1 all the time for all the frames?
 * d: duration - the number of frames altogether?
 **/

Math.easeOutCubic = function (t, b, c, d) {
    t /= d;
    t--;
    return c*(t*t*t + 1) + b;
};

Math.easeInOutCubic = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t + 2) + b;
};