var sliderTemplate = "";
var apiURL = "";
$(window).load(function(){
	// With JQuery
	$('input.slider[data-slider-id="1"]').slider({
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});

	getServoPositions();
	
});


$(document).ready(function(){

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
					$('input.slider[data-slider-id="'+newSliderId+'"]').slider({formatter: function(value) {return 'Current value: ' + value;}});
				}
			}

		}

		getServoPositions();
	});
});

function getServoPositions(){
	$(".aServoControl input.slider").each(function(key, el){
		$.getJSON( "ajax/test.json", function( data ) {
		  console.log(data);
		  //el.slider('setValue', newValue);
		});
	})
}