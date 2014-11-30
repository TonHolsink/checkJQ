	var map = null;
	var homeMarker;
	var searchBox;
	var currentCenter;
	var pts = []; 
	var bounds = new GLatLngBounds();
	// indicates the state of the page
	// 0 = initial
	// 1 = show meetingtype
	// 2 = handle ww question/phone question
	// 3 = handle date
	// 4 = handle time
	var state = 0;
	// type of user : 
	// 1 = customer
	// 2 = supplier
	var userType;
	var isInternet = false;
	var isTelephone = false;
	//makes sure resubmitting is blocked while moving the map to accomodate 
	//a balloon
	var baseIcon = new GIcon();
	    baseIcon.iconSize = new GSize(32,32);
	    baseIcon.iconAnchor = new GPoint(16,32);
	    baseIcon.infoWindowAnchor = new GPoint(16,0);
	    
	var home = new GIcon(baseIcon, "http://maps.google.com/mapfiles/kml/pal3/icon56.png", null, "http://maps.google.com/mapfiles/kml/pal3/icon56.png");

	function doSubmitSearch(drag) {
		var placepostal = document.getElementById('placepostal');
 		var postal;
 
		if (placepostal.value == "") {
			alert('Postcode of plaats moet ingevuld zijn');
			return false;
		}
 
		if (undefined != homeMarker) {
			map.removeOverlay(homeMarker);
		}
		if (undefined != searchBox) {
			map.removeOverlay(searchBox);
		}
		
		document.forms[0].basey.value = '';		
		document.forms[0].basex.value = '';		
		document.forms[0].zoomlevel.value = ''; 
		map.clearOverlays();					

		var url='loadMapData.html';
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: $('agendaPage1Form').serialize(true),
			 	onComplete: showAddresses
			}
		);
	}

	function doSupplierSubmitSearch(drag) {
 
		if (undefined != homeMarker) {
			map.removeOverlay(homeMarker);
		}
		if (undefined != searchBox) {
			map.removeOverlay(searchBox);
		}
		
		document.forms[0].basey.value = '';		
		document.forms[0].basex.value = '';		
		document.forms[0].zoomlevel.value = ''; 
		map.clearOverlays();					

		var url='loadMapData.html';
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: $('agendaPage1Form').serialize(true),
			 	onComplete: showSupplierAddresses
			}
		);
	}
	
	var currentMarker;
	function createMarker(point,html,icon) {
		var marker = new GMarker(point,icon);
		if (icon < 2) {
			GEvent.addListener(marker, "click", function() {
				currentMarker = this;
				var url='loadMarkerDetails.html';
				new Ajax.Request
				(
					url,
					{
						method: 'get',
						parameters: 'id=' + html,
					 	onComplete: setMarkerHTML
					}
				);
			    
			});
		} else {
			//create supplier marker, we go to a new page on click
			GEvent.addListener(marker, "click", function() {
				currentMarker = this;
				var url='loadSupplierAgenda.html?loc=' + html;
				//what to do here?
				window.location = url;
			});
			
		}
		map.addOverlay(marker);
		return marker;
	}


	function setMarkerHTML(request) {
		var label1 = "Bureau";
	  	var markerHTML = request.responseText;
		
        var jsonData = eval('(' + markerHTML + ')');

		var tab = "<div id='mTab1'>";
		tab1+= "<div class='balloonTable'><table>";
//		for (var j=0; j < jsonData.orders.length; j++) {
//			
//			var order = jsonData.orders[j];
//	        var pName = order.name;
//	        var street = order.street;
//	        var postalcode = order.postalcode;
//	        var place = order.place;
//	        var pDistance = order.distance;
//	        
//			tab1+= "<tr><td class='col1'>";
//			tab1+= "Naam</td><td>"  + pName + "</td></tr>";
//			tab1+= "<tr><td>Adres</td><td>" + street + "</td></tr>";
//			tab1+= "<tr><td>&nbsp;</td><td>" + postalcode + " " + place + "</td></tr>";
//			tab1+= "<tr><td colspan=2><hr/></td></tr>";
//
//		}    
	    var distance = homeMarker.getPoint().distanceFrom(currentMarker.getPoint())/1000;
		tab1+= "<tr><td>Afstand</td><td>" + distance.toFixed(2) + "km</td></tr>";
		tab1+= "</table></div></div>";

	    currentMarker.openInfoWindowHtml(tab1);
	    
	    GEvent.addListener(map.getInfoWindow(), "closeclick", function() {
    		map.panTo(currentCenter);
	    });
	}

	function showAddress(locx, locy, html, label, state) {
		var glatlong = new GLatLng(locx, locy);
		createMarker(glatlong, html, state);
		bounds.extend(glatlong);
	}

    function entsub(event) {
		if (window.event && window.event.keyCode == 13) {
	    	doSubmitSearch(0);
	    	return false;
		} else if (event && event.which == 13) {
	    	doSubmitSearch(0);
	    	return false;
		} else	{
    		return true;
    	}
    }


    //BOTTOM SCRIPTS
	function showAddresses(request) {
		var locations;
		//Holds the nr of available locations
		var locationsAvailable = 0 ;
		var noAddress = 0;
		bounds = new GLatLngBounds();
				
	  	var items = request.responseText;
        	var jsonData = eval('(' + items + ')');
		
		//iterate over json data and create markers from that
		for (var j=0; j < jsonData.locations.length; j++) {
			
			var order = jsonData.locations[j];
			var html = order.id + "&housenumber=" + order.housenumber;
			var locx = order.locx;
			var locy = order.locy;
			var available = order.available;
		    if (available) {
		    	locationsAvailable += 1;
		    }
		    var label = "";
		    //give available to determine color. tbd
		    //last num = state : 0 = not av., 1 = av., 2 = supplier user
		    showAddress(locx, locy, html, label, 0);
		}
		
		if (undefined == jsonData.locations || jsonData.locations.length == 0) {
			alert("Er zijn geen bureaus gevonden in uw omgeving.");
		}

		var xbase = jsonData.homex;
		var ybase = jsonData.homey;
		var glatlong = new GLatLng(xbase, ybase, false);
		homeMarker = createMarker(glatlong,"Er is gezocht vanuit deze lokatie",home);
		map.addOverlay(homeMarker);

		var distance = jsonData.searchdistance;

		map.setCenter(bounds.getCenter());
		map.setZoom(map.getBoundsZoomLevel(bounds));

		if (map.getZoom() > 9 && jsonData.locations.length == 0) {
			map.setZoom(9);
		}
		currentCenter = map.getCenter();

		//handle state, only if we still have available locations
		if (locationsAvailable > 0) {
			handleState(jsonData);
		}
	}

	function showSupplierAddresses(request) {
		var locations;
		//Holds the nr of available locations
		var locationsAvailable = 0 ;
		var noAddress = 0;
		bounds = new GLatLngBounds();
				
	  	var items = request.responseText;
        	var jsonData = eval('(' + items + ')');
		
		//iterate over json data and create markers from that
		for (var j=0; j < jsonData.locations.length; j++) {
			
			var order = jsonData.locations[j];
			var html = order.id + "&housenumber=" + order.housenumber;
			var locx = order.locx;
			var locy = order.locy;
			var available = order.available;
		    if (available) {
		    	locationsAvailable += 1;
		    }
		    var label = "";
		    //give available to determine color. tbd
		    //last num = state : 0 = not av., 1 = av., 2 = supplier user
		    showAddress(locx, locy, html, label, 2);
		}
		
		if (undefined == jsonData.locations || jsonData.locations.length == 0) {
			alert("Er zijn geen bureaus gevonden in uw omgeving.");
		}

		map.setCenter(bounds.getCenter());
		map.setZoom(map.getBoundsZoomLevel(bounds));

		if (map.getZoom() > 9 && jsonData.locations.length == 0) {
			map.setZoom(9);
		}
		currentCenter = map.getCenter();

		//handle state, only if we still have available locations
		if (locationsAvailable > 0) {
			handleState(jsonData);
		}
	}
	
	// performs actions based on state
	function handleState(jsonData) {
		//alert("state = " + state);
		if (state == 0) {
			//Fill meeting drop down list
			var anOption = new Option("Kies reden afspraak...", "");
			document.getElementById("meetingtype").options[0] = anOption; 
			for (var j=0; j < jsonData.meetingtypes.length; j++) {
				var mt = jsonData.meetingtypes[j];
				var label = mt.label;
				var value = mt.value
				var anOption = new Option(value, label);
				document.getElementById("meetingtype").options[j+1] = anOption; 
			}
			//Open meeting type block
			document.getElementById("meetingtype_row").style.display = "block";
			state = 1;
		} else if (state == 1) {
			isInternet = jsonData.internet;
			isTelephone = jsonData.telephone;
			//We have selected a meetingtype, get the details and decide on the next step. 
			if (jsonData.internet) {
				document.getElementById("internet_row").style.display = "block";
				state = 2;
			} else if (isTelephone) {
				document.getElementById("telephone_row").style.display = "block";
				state = 2;
			} else {
				document.getElementById("date_row").style.display = "block";
				state=3;
			}

			return;
		} 

	}

	function meetingTypeSelected() {
		state = 1;
		document.getElementById("internet_row").style.display = "none";
		document.getElementById("telephone_row").style.display = "none";
		document.getElementById("date_row").style.display = "none";
		document.getElementById("time_row").style.display = "none";
		document.forms[0].date.value='';
		document.forms[0].time.value='';
		document.forms[0].internet.value='';
		document.forms[0].telephone.value='';
	}
	
	function doInternet(value) {
		if (value == "yes") {
			document.getElementById("internet_box").style.display = "block";
		} else {
			if (isTelephone) {
				document.getElementById("telephone_row").style.display = "block";
			}	
		}
	}

	function buildMap(xbase, ybase) {
		map = new GMap2(document.getElementById("agendamap"));
		map.addControl(new GMapTypeControl());
		map.addControl(new GSmallMapControl());

		var glatlong = new GLatLng(xbase, ybase, false);
		map.setCenter(glatlong,12);
		currentCenter = map.getCenter();
		homeMarker = createMarker(glatlong,"Er is gezocht vanuit deze lokatie",home);
		map.addOverlay(homeMarker);
		map.setZoom(9);
	}

	function buildSupplierMap(xbase, ybase) {
		map = new GMap2(document.getElementById("agendamap"));
		map.addControl(new GMapTypeControl());
		map.addControl(new GSmallMapControl());

		var glatlong = new GLatLng(xbase, ybase, false);
		map.setCenter(glatlong,12);
		currentCenter = map.getCenter();
		document.forms[0].basey.value = '';		
		document.forms[0].basex.value = '';		
		document.forms[0].zoomlevel.value = ''; 
		map.clearOverlays();					

		var url='loadMapData.html';
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: $('agendaPage1Form').serialize(true),
			 	onComplete: showSupplierAddresses
			}
		);
	}
	
	function trMouseIn(tdElement) {
		tdElement.parentNode.style.backgroundColor='lightgrey';
		tdElement.parentNode.style.cursor='pointer';
	}

	function trMouseOut(tdElement) {
		tdElement.parentNode.style.backgroundColor='white';
		tdElement.parentNode.style.cursor='default';
	}
    