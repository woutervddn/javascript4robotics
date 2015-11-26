"use strict";

var Cylon = require('cylon');

var SERVO_BEGIN_POSITIONS = [245,245,235,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //All servo's on 0;
var servoPositions = [];
var MAX_DEGREES_PER_SECOND = 180;
var SERVOS_IN_USE = 4

Cylon.robot({
  name: 'robotArm',

  // This is how we define custom events that will be registered
  // by the API.
  events: ['servo_positions', 'turned_off', 'turned_on', 'actuate_servo'],

  // These are the commands that will be availble in the API
  // Commands method needs to return an object with the aliases
  // to the robot methods.
  commands: function() {
    return {
      actuate_servo: this.actuateServo,
      servo_position: this.servoPosition,
      turn_on: this.turnOn,
      turn_off: this.turnOff,
      toggle: this.toggle
    };
  },

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 },
    dsscx18s: { driver: "dsscx18s" }
  },

  actuateServo: function(pin, val){
    var servoBoard = this.dsscx18s;
    actuate_servo(servoBoard, pin, val);
    this.emit("actuate_servo", "{actuating: { {pin:"+pin+"},{from:"+servoPositions[pin-1]+"}, {to:"+val+"}}}");
  },

   work: function() {
    // We setup two time outs to turn on
    // and turn off the led device.
    // this will trigger an event that
    // we'll to listen to in the client
    var servoBoard = this.dsscx18s;
    init_servos( servoBoard );
    //this.turnOn();
    /*after((2).seconds(), function() {
      this.turnOn();
    }.bind(this));

    after((5).seconds(), function() {
      this.turnOff();
    }.bind(this));**/
  },

  turnOn: function() {
    this.led.turnOn();
    this.emit('turned_on');
  },

  turnOff: function() {
    this.led.turnOff();
    this.emit('turned_off');
  },

  toggle: function() {
    this.led.toggle();
    if (this.led.isOn()) {
      this.emit('turned_on');
    } else {
      this.emit('turned_off');
    }
  },
  servoPosition: function(){
    //return servo position here
    if( servoPositions.length == 0 ) {
      servoPositions= SERVO_BEGIN_POSITIONS.slice();
    }

    console.log(servoPositions);

    var json = JSON.stringify( servoPositions );
    this.emit( "servo_positions", json );
    //var json = JSON.stringify( "tst" );
    //this.emit( servoPositions );
  }
}); //.start();


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
      servoPositions[ ((servoPin-1)) ] = parseInt( newPosition );
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

Cylon.start();


/* POSITION FUNCTIONS */
var init_servos = function(servoBoard){
  console.log("initing servo positions...");

  if( servoPositions.length == 0 ) {
    servoPositions= SERVO_BEGIN_POSITIONS.slice();
  }

  for (var i = 0; i < servoPositions.length; ++i) {
    var callback = function(){ return 0; }
    servoBoard.servo_go_to_pos(i+1, servoPositions[i], true, callback);
    console.log("servo " + i + " set to start position ("+servoPositions[i]+")");
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
