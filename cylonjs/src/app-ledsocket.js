'use strict';

var Cylon = require('cylon');

Cylon.robot({
  name: 'robotArm',

  // This is how we define custom events that will be registered
  // by the API.
  events: ['turned_on', 'turned_off'],

  // These are the commands that will be availble in the API
  // Commands method needs to return an object with the aliases
  // to the robot methods.
  commands: function() {
    return {
      turn_on: this.turnOn,
      turn_off: this.turnOff,
      toggle: this.toggle
    };
  },

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 }
  },

  work: function() {
    // We setup two time outs to turn on
    // and turn off the led device.
    // this will trigger an event that
    // we'll to listen to in the client
    after((2).seconds(), function() {
      this.turnOn();
    }.bind(this));

    after((5).seconds(), function() {
      this.turnOff();
    }.bind(this));
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
  }
});

Cylon.api(
  'socketio',
  {
  host: '0.0.0.0',
  port: '3000'
});

Cylon.start();