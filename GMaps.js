var map;

//Initialize the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 1,
		center: {lat: 0, lng: 0}
	});

	//https://nominatim.openstreetmap.org/search/Austin%20TX%20?format=xml&addressdetails=1&limit=1&polygon_kml=1
	
	document.getElementById('genPoly').onclick = function genPoly() {
		//Indicate Loading
		document.getElementById("coords").innerHTML="<style=float:center><h1>Loading...</h1></style>";
		var check = 0;
		var info = [];
		info.push(document.getElementById('street').value);
		info.push(document.getElementById('city').value);
		info.push(document.getElementById('county').value);
		info.push(document.getElementById('state').value);
		info.push(document.getElementById('country').value);
		info.push(document.getElementById('postalcode').value);
		
		var nominatimCall = "https://nominatim.openstreetmap.org/search/";
		var endCall = "?format=xml&limit=1&polygon_kml=1&email=bab178@txstate.edu";
		
		//Create nominatim URL
		for(var i = 0; i < info.length; i++)
			if(info[i] !== '')
			{
				//Change spaces to %20
				for(var j = 0; j < info[i].length; j++)
					if(info[i][j] === ' ')
						info[i] = info[i].slice(0, j) + "%20" + info[i].slice(j+1,info[i].length);
				//Add to nominatim URL
				if(check === 0)
					nominatimCall = nominatimCall.concat(info[i]);
				else
					nominatimCall = nominatimCall.concat('%20'+info[i]);
				
				check = 1;	
			}
		if(check === 0)
		{
			alert("Nothing entered. Enter something to generate a Polygon.");
			return;
		}
		//Finish URL
		nominatimCall = nominatimCall.concat(endCall);
		
		var coordinates, place;
		var paths = [], finalPath = [];
		
		//https://stackoverflow.com/questions/6375461/get-html-code-using-javascript-with-a-url
		function makeHttpObject() {
		  try {return new XMLHttpRequest();}
		  catch (error) {}
		  try {return new ActiveXObject("Msxml2.XMLHTTP");}
		  catch (error) {}
		  try {return new ActiveXObject("Microsoft.XMLHTTP");}
		  catch (error) {}

		  throw new Error("Could not create HTTP request object.");
		}
		var request = makeHttpObject();
		request.open("GET", nominatimCall, true);
		request.send(null);
		request.onreadystatechange = function() {
			//HTML Request ready
		  if (request.readyState === 4 && request.status === 200)
		  {
			document.getElementById("coords").innerHTML=request.responseText;
			if($("coordinates").html() === null)
			{
				document.getElementById("coords").innerHTML = "No results found.";
				return;
			}
			//Get coordinates from jQuery call
			coordinates = $("coordinates").html();
			place = $("searchresults").html();
			document.getElementById("coords").innerHTML=$("coordinates").html();
			
			//Get place name from searchresults
			place = place.split("display_name=\"");
			place = place[1].split("\" class");
			place = place[0];
			console.log(place);
			document.getElementById("place").innerHTML='<p>'+place+'</p>';
			
			//Parse HTML into Google Maps LatLng Objects
			paths = coordinates.split(" ");
			for(var i = 0; i < paths.length; i++)
			{
				x = paths[i].split(",");
				finalPath.push(new google.maps.LatLng(x[1],x[0]));
			}
			
			//DRAW THE POLYGON OR POLYLINE
			var CityHightlight = new google.maps.Polygon({
				paths: finalPath,
				strokeColor: 'red',
				strokeOpacity: 1,
				strokeWeight: 1,
				fillColor: 'white',
				fillOpacity: 0
			});
			CityHightlight.setMap(map);
			
			//clear HTML
			document.getElementById("coords").innerHTML = "";
			//Add to HTML
			for(var i = 0; i < finalPath.length-1; i++)
				document.getElementById("coords").innerHTML+=('<p>'+'new google.maps.LatLng'+finalPath[i]+',</p>');
			//Remove last comma
			document.getElementById("coords").innerHTML+=('<p>'+'new google.maps.LatLng'+finalPath[finalPath.length-1]+'</p>');

		  }
		};
	}
}
google.maps.event.addDomListener(window, 'load', initMap);