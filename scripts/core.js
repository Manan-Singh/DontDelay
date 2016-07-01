var mainApp = angular.module("mainApp", []);

mainApp.controller("ctrl", function($scope, $http){
	
	$scope.submitIATA = function(){
		//Get the IATA code from the text field
		var apCode = $("#airport-code-input").val();

		//Launch an AJAX request
		$http.get("http://services.faa.gov/airport/status/"+ apCode + "?format=application/json")
		.then(function(response){

			//Clear the previous info displayed
			$("#airport-info-view").empty();

			var airport = response.data;
			
			//If the AJAX request was successful, then start displaying the information
			$("#airport-info-view").append("<h2 style='color: blue;'>" + airport.IATA + " - " + 
				airport.name +  "</h2>");

			$("#airport-info-view").append("<p>" + "Location: " + airport.city + ", " +  
				airport.state + "</p>");

			$("#airport-info-view").append("<p>" + 
				"Weather: " + airport.weather.weather + " | Temp: " + airport.weather.temp 
			 + "</p>");

			//If there's a delay, state the reason. If not,show that there is no delay
			if(airport.delay === "true"){
				console.log("hi");
				$("#airport-info-view").append("<h3 style='color: red;'>" + "DELAYED DUE TO " 
					+ airport.status.reason + "</h3>");
			}else{
				console.log(airport.delay);
				$("#airport-info-view").append("<h3 style='color: green;'>" + "NOT DELAYED" + "</h3>");
			}

		});
	}
});

mainApp.controller("ctrl2", function($scope, $http){

	$(document).ready(function(){

			//Load the first item manually, albeit there will be a bit of visible lag
			$http.get("http://services.faa.gov/airport/status/"+ $('.item:first').text() 
					+ "?format=application/json").then(function(response){
						var firstItem = $('.item:first');
						$('h2', firstItem).css("color", (response.data.delay === 'true') ? '#FF4646':'green');
						$('.ap-min-display' ,firstItem).append('<p>'+response.data.name+' is currently '+
							((response.data.delay === 'true') ? 'delayed':'not delayed')+'</p>');
						$('.ap-min-display', firstItem).append("<p>" + 
							"Location : " + response.data.city + ", " + response.data.state
						 + "</p>");
						$('.ap-min-display', firstItem).append("<p>" + 
							"Weather: " + response.data.weather.weather + " | " +
							"Temp: " + response.data.weather.temp
						 + "</p>");

						firstItem.addClass('loaded');
					});

			//On page load, modify the carousel so that it can do lazy ajax loading
			$("#delayed").on('slide.bs.carousel', function(e){

			//The next item that will be put onto the carousel to be displayed
			var nextItem;
			//The currently active item
			var activeItem = $('.item.active', this);

			//Need to get the direction of the next slide so that you can make any ajax calls if neccessary
			if(e.direction == 'left'){
				nextItem = activeItem.next('.item');
			}else{
				nextItem = activeItem.prev('.item');
				//In case you are on the first item
				if(activeItem.index() == 0){
					nextItem = $('.item:last');
				}
			}

			if(!nextItem.hasClass('loaded')){
				//Make the AJAX call. Also note that this call will only happen ONCE for each
				//item in the carousel
				$http.get("http://services.faa.gov/airport/status/"+ $('h2', nextItem).text() 
					+ "?format=application/json").then(function(response){
						$('h2', nextItem).css("color", (response.data.delay === 'true') ? '#FF4646':'green');
						$('.ap-min-display' ,nextItem).append('<p>'+response.data.name+' is currently '+
							((response.data.delay === 'true') ? 'delayed':'not delayed')+'</p>');
						$('.ap-min-display' ,nextItem).append("<p>" + 
							"Location : " + response.data.city + ", " + response.data.state
						 + "</p>");
						$('.ap-min-display' ,nextItem).append("<p>" + 
							"Weather: " + response.data.weather.weather + " | " +
							"Temp: " + response.data.weather.temp
						 + "</p>");
						$(nextItem).addClass("loaded");
					});
			}
		});
	});

});