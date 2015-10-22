"use strict";

var Cylon = require('cylon');

Cylon.robot({
  name: 'arm',

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 },
    dsscx18s: { driver: "dsscx18s" }
  },

  work: function() {
    // Normally you add your robot code here,
    // for this example with socket.io
    // we are going to be interacting
    // with the robot using the code in
    // the client side.
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

// We setup the api specifying `socketio`
// as the preffered plugin
Cylon.api(
  'socketio',
  {
  host: '0.0.0.0',
  port: '3000'
});



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