var DEBUG = true;

var sliderTemplate = "";
var apiURL = "";
var robot;
var test = null;
var servoPositions = [];

/*
$(document).ready(function(){

  apiURL = "http://127.0.0.1:3000/api/robots/robotArm";

  // We connect to the 'chappie' robot using its namespace(nsp)
  robot = io(apiURL);

  // Listen to the 'message' event on the robot
  //robot.on('message', function(msg) {
  //  $('#messages').append($('<li>').text(msg.name));
    //console.log(msg);
  //});

  robot.on('servo_positions', function(data){
    console.log('servo position triggered:');
    data = JSON.parse(data);
    console.log(data);
  });

  robot.on('actuate_servo', function(data){
    console.log('actuate:');
    console.log(data);
  });

  robot.emit("servo_position");
  return false;
});

*/

$(document).ready(function(){
	$("#apiUrl").val("http://" + window.location.hostname + ":3000/api/robots/robotArm");
});

$(window).load(function(){

	sliderTemplate = $('.aServoControl').clone();

	$('#servoForm').submit(function(e){
		e.preventDefault();

		var newNumberOfServos = $("#servos").val();
		apiURL = $("#apiUrl").val();

		if($(".aServoControl").length != newNumberOfServos ){
			//change number of servo's

			if( $(".aServoControl").length > newNumberOfServos ){
				var diff = $(".aServoControl").length - newNumberOfServos;
				for(var i=0; i<diff;i++){
					$(".aServoControl:last").remove();
				}
			} else {
				var diff = newNumberOfServos - $(".aServoControl").length;
				for(var i=0; i<diff;i++){
					var prevSliderId = parseInt( $('.aServoControl:last').find("input.slider").attr("data-slider-id") );
					var newSliderId = prevSliderId + 1;
					sliderTemplate.clone().appendTo('.servoControls')
					$('.aServoControl:last').find("input.slider").attr("data-slider-id", newSliderId);
					$('.aServoControl:last').find(".servoNo").html(newSliderId);
					//$('input.slider[data-slider-id="'+newSliderId+'"]').slider({formatter: function(value) {return 'Current value: ' + value;}});
				}
			}

		}

		$(".generalControl").slideUp();
		init_slider();
		init_robot();
		getServoPositions();
	});
});

function init_slider(){


	$('input.slider').each(function(){
		//Format sliders
		$(this).slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			},
		});

		//listen for slider change
		$(this).slider().on('slideStop', function(ev){
			//robot.emit()
			pin = $(this).attr("data-slider-id");
			val = $(this).val();
			robot.emit("actuate_servo", pin, val);

			if ( DEBUG ){
				console.log("move slider " + pin + " from value " + servoPositions[pin-1] + " to value: " + val);
			} 
			servoPositions[pin-1] = val;
		});
	});




	$(".servoControls").slideDown();
}

function init_robot(){
	// We connect to the 'chappie' robot using its namespace(nsp)
	robot = io(apiURL);

	// Listen to the 'message' event on the robot
	//robot.on('message', function(msg) {
	//  $('#messages').append($('<li>').text(msg.name));
	//console.log(msg);
	//});

	robot.on('servo_positions', function(data){
		if ( DEBUG ){
			console.log("init robot servo positions: " + data);
		}

		test = data;
		var parsedPositions = JSON.parse(data);
		servoPositions = parsedPositions;

		if ( DEBUG ){
			console.log("init robot servo positions: " + servoPositions);
		}

		$('input.slider').each(function(key){
			//Set default values
			$(this).slider('setValue', servoPositions[key]);
		});

		if( DEBUG ){
			console.log('servo position triggered:');
			console.log(data);
		}
	});

	robot.on('actuate_servo', function(data){
		if( DEBUG ){
			console.log('actuate: ' + data);
		}
	});

	robot.emit("servo_position");
	return false;
}

function getServoPositions(){
	robot.emit("servo_position");
}