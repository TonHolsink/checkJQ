(function() {
	//LOCATION
	this.locationSelected = function(id) {
		var url='eaa_editlocatie.html?mode=load&id=' + id;
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				onComplete: showLocationDetails
			}
		);
	};

	this.savelocation = function(cbFunc) {
		if ($('loc_id').getValue() >= 0) {
			resetLocationErrors();
			var errors = checkLocationFormData();

			if (errors == 0) {
				var url='eaa_editlocatie.html';
				new Ajax.Request
				(
					url,
					{
						method: 'get',
						parameters: $('eaaManagementForm').serialize(true),
						onComplete: procesSaveLocationResult(cbFunc)
					}
				);
			}
		}
	};

	function checkLocationFormData() {
		var errors = 0;
		if ($('loc_id').value == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Selecteer eerst een locatie op de kaart.');
		} else if ((($('loc_name').value).strip()) == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Bureaunaam is verplicht.');
		} else if ((($('loc_code').value).strip()) == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Code is verplicht.');
		} else if ((($('loc_street').value).strip()) == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Straat en huisnummer zijn verplicht');
		} else if ((($('loc_housenumber').value).strip()) == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Straat en huisnummer zijn verplicht');
		} else if ((($('loc_postal').value).strip()) == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Postcode is verplicht');
		} else if ((($('loc_place').value).strip()) == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Plaatsnaam is verplicht');
		} else if ((($('loc_phone').value).strip()) == '') {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Telefoonnummer is verplicht');
		} else if (isNaN(parseFloat($('loc_x').value)) || isNaN(parseFloat($('loc_y').value))) {
			errors++;
			$('error_content').style.display = 'block';
			$('errorText').update('Co&ouml;rdinaten moeten een decimaal getal zijn');
		}
		return errors;
	};

	function resetLocationErrors() {
		$('messageText').update("");
		$('errorText').update("");
		$('error_content').setStyle({display: 'none'});
	};

	function resetLocationData() {
		$('loc_id').value = '';
		$('loc_type').selectedIndex = 0;
		$('loc_name').value = '';
		$('loc_code').value = '';
		$('loc_street').value = '';
		$('loc_housenumber').value = '';
		$('loc_postal').value = '';
		$('loc_place').value = '';
		$('loc_phone').value = '';
		$('loc_email').value = '';
		$('loc_active').checked = false;
		$('loc_locationTelephone').checked = false;
		$('loc_rsc3d').checked = false;
		$('loc_limitedWeekend').checked = false;
		$('locationRoles').update('');
		$('openingHoursMon').value = '';
		$('openingHoursTue').value = '';
		$('openingHoursWed').value = '';
		$('openingHoursThu').value = '';
		$('openingHoursFri').value = '';
		$('openingHoursSat').value = '';
		$('openingHoursSun').value = '';
		$('saveLocationMeetingtypesLink').setStyle({display: 'none'});
	};

	this.showRSCFor3D = function() {
		if ($('loc_locationTelephone').checked == false) {
			$('loc_rsc3d').checked = false;
			$('loc_rsc3d_span').hide();
		} else {
			$('loc_rsc3d_span').show();
		}
	};

	function showLocationDetails(request) {
		switchtab(1);
		resetLocationData();
		var location = request.responseText.evalJSON();
		//base data
		$('loc_id').value = location.locationid;
		$('loc_type').value = location.locationtype;
		$('loc_name').value = location.name;
		$('loc_code').value = location.code;
		$('loc_street').value = location.street;
		$('loc_housenumber').value = location.housenumber;
		$('loc_postal').value = location.postal;
		$('loc_place').value = location.place;
		$('loc_phone').value = location.phone;
		$('loc_email').value = location.email;
		$('loc_x').value = location.locx;
		$('loc_y').value = location.locy;
		$('openingHoursMon').value = location.openinghours[0];
		$('openingHoursTue').value = location.openinghours[1];
		$('openingHoursWed').value = location.openinghours[2];
		$('openingHoursThu').value = location.openinghours[3];
		$('openingHoursFri').value = location.openinghours[4];
		$('openingHoursSat').value = location.openinghours[5];
		$('openingHoursSun').value = location.openinghours[6];

		if (location.active) {
			$('loc_active').checked = true;
		} else {
			$('loc_active').checked = false;
		}
		if (location.telephoneLocation) {
			$('loc_locationTelephone').checked = true;
		} else {
			$('loc_locationTelephone').checked = false;
		}
		if (location.rsc3d) {
			$('loc_rsc3d').checked = true;
		} else {
			$('loc_rsc3d').checked = false;
		}

		showRSCFor3D();

		//3D locatie: verbergen rsc checks
		if ($('loc_type').getValue() == "2") {
			$('loc_locationTelephone_row').hide();
		} else {
			$('loc_locationTelephone_row').show();
		}

		if (location.limitedWeekend) {
			$('loc_limitedWeekend').checked = true;
		} else {
			$('loc_limitedWeekend').checked = false;
		}
	};

	function procesSaveLocationResult(cbFunc) {
		return function(request) {
			//set message(s)
			var jsonData = request.responseText.evalJSON();
			var nrErrors = 0;
			for (var j=0; j < jsonData.messages.length; j++) {

				var message = jsonData.messages[j];
				var mType = message.messagetype;
				var mText = message.messagetext;
				var fieldname = message.fieldname;
				if (mType == "error_req" || mType == "error_func") {
					if (undefined != fieldname &&
						fieldname.length > 0) {
					}
					nrErrors++;
					$('error_content').setStyle({display: 'block'});
					$('errorText').update(mText);
				}
			}

			//if ok
			if (nrErrors == 0) {
				$('error_content').setStyle({display: 'block'});
				$('messageText').update("Locatie opgeslagen");
			}

			new Effect.Highlight('error_content', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 })

			//If callback defined, execute it
			if (cbFunc) {
				cbFunc(nrErrors);
			}
		}
	};

	//MEETINGTYPE
	this.loadMeetingtypeDetails = function(code) {
		resetMeetingtypeErrors();
		var url='eaa_editmeetingtype.html?mode=load&code=' + code;
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: $('eaaManagementForm').serialize(true),
				onComplete: showMeetingtypeDetails
			}
		);
	};

	this.savemeetingtype = function() {
		resetMeetingtypeErrors();
		var errors = checkMeetingtypeFormData();

		if (errors == 0) {
			var url='eaa_editmeetingtype.html';
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: $('eaaManagementForm').serialize(true),
					onComplete: procesSaveMeetingtypeResult
				}
			);
		}
	};

	function resetMeetingtypeErrors() {
		$('messageText').update("");
		$('errorText').update("");
		$('error_content').setStyle({display: 'none'});
	};

	function checkMeetingtypeFormData() {
		var errors = 0;
		if ($('mt_name').value == '') {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Afspraaktype naam is verplicht.');
		} else if (($('mt_timeunits').value < 1) || ($('mt_timeunits').value > 10)) {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Aantal tijdblokken kan niet 0 of groter dan 10 zijn.');
		} else if ($('mt_maxfuture').value == '0') {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Kies een planhorizon.');
		} else if ($('mt_maxfuture').value != '1' && $('mt_maxfuture').value != '2' &&
				   $('mt_maxfuture').value != '3' && $('mt_maxfuture').value != '30') {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Planhorizon moet 1, 2, 3, of 30 dagen zijn.');
		}
		return errors;
	};

	function procesSaveMeetingtypeResult(request) {
		//set message(s)
		var jsonData = request.responseText.evalJSON();
		var nrErrors = 0;
		for (var j=0; j < jsonData.messages.length; j++) {

			var message = jsonData.messages[j];
			var mType = message.messagetype;
			var mText = message.messagetext;
			var fieldname = message.fieldname;
			if (mType == "error_req" ||
					mType == "error_func") {
				if (undefined != fieldname &&
					fieldname.length > 0) {
				}
				nrErrors++;
				$('error_content').setStyle({display: 'block'});
				$('errorText').update(mText);
			}
		}

		//if ok
		if (nrErrors == 0) {
			var meetingtypeid = jsonData.meetingtypeid;
			$('mt_meetingtypeid').value = meetingtypeid;
			$('error_content').setStyle({display: 'block'});
			$('messageText').update("Afspraaktype opgeslagen");
		}

		new Effect.Highlight('error_content', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 })
	};

	function resetMeetingtypeData() {
	};

	function showMeetingtypeDetails(request) {
		resetMeetingtypeData();
		var meetingtype= request.responseText.evalJSON();
		//base data
		$('mt_code').value = meetingtype.code;
		$('mt_name').value = meetingtype.name;
		$('mt_timeunits').value = meetingtype.units;
		$('mt_maxfuture').value = meetingtype.maxfuture;
		$('mt_meetingtypeid').value = meetingtype.meetingtypeid;
		//$('confirmtime').innerHTML = meetingtype.confirmtime;
		if (meetingtype.isinternet) {
			$('mt_internet').checked = true;
		} else {
			$('mt_internet').checked = false;
		}
		if (meetingtype.istelephone) {
			$('mt_telephone').checked = true;
		} else {
			$('mt_telephone').checked = false;
		}
		if (meetingtype.confidential) {
			$('mt_confidential').checked = true;
		} else {
			$('mt_confidential').checked = false;
		}
		if (meetingtype.showextern) {
			$('mt_showexternal').checked = true;
		} else {
			$('mt_showexternal').checked = false;
		}
		if (meetingtype.restricted) {
			$('mt_restricted').checked = true;
		} else {
			$('mt_restricted').checked = false;
		}
		if (meetingtype.goods) {
			$('mt_goods').checked = true;
		} else {
			$('mt_goods').checked = false;
		}
		if (meetingtype.weekendAllowed) {
			$('mt_weekendAllowed').checked = true;
		} else {
			$('mt_weekendAllowed').checked = false;
		}
	};

	//Location meetingtypes
	this.savelocationmeetingtypes = function() {
		if ($('loc_id').getValue() > 0) {
			resetLocationMeetingtypeErrors();

			var url='eaa_editlocationmeetingtype.html?mode=savelocmt';
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: $('eaaManagementForm').serialize(true),
					onComplete: procesSaveLocationMeetingtypeResult
				}
			);
		}
	};

	function resetLocationMeetingtypeErrors() {
		$('messageText2').update("");
		$('errorText2').update("");
		$('error_content2').setStyle({display: 'none'});
	};

	function procesSaveLocationMeetingtypeResult(request) {
		//set message(s)
		var jsonData = request.responseText.evalJSON();
		var nrErrors = 0;
		for (var j=0; j < jsonData.messages.length; j++) {

			var message = jsonData.messages[j];
			var mType = message.messagetype;
			var mText = message.messagetext;
			var fieldname = message.fieldname;
			if (mType == "error_req" ||
					mType == "error_func") {
				if (undefined != fieldname &&
					fieldname.length > 0) {
				}
				nrErrors++;
				$('error_content2').setStyle({display: 'block'});
				$('errorText2').update(mText);
			}
		}

		//if ok
		if (nrErrors == 0) {
			var meetingtypeid = jsonData.meetingtypeid;
			$('error_content2').setStyle({display: 'block'});
			$('messageText2').update("Afspraaktypes opgeslagen");
		}

		new Effect.Highlight('error_content2', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 })
	};

	this.loadLocationMeetingtypeDetails = function() {
		resetLocationMeetingtypeErrors();
		resetLocationErrors();
		resetLocationTimesErrors();
		resetLocationCapacityErrors()
		var url='eaa_editlocationmeetingtype.html?mode=loadlocmt';
		switchtab(2);
		if ($('loc_id').getValue() > 0) {
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: $('eaaManagementForm').serialize(true),
					onComplete: showLocationMeetingtypeDetails
				}
			);
		}
	};

	function showLocationMeetingtypeDetails(request) {
		resetLocationMeetingtypeData();
		var meetingtypes = request.responseText.evalJSON();

		$('locationRoles').innerHTML = "";
		var html="";

		for (var j=0; j < meetingtypes.types.length; j++) {
			var mt = meetingtypes.types[j];
			var select = meetingtypes.selected[j];

			html += "<input type='checkbox' value='";
			html += mt.value + "' name='selectedTypes' ";
			if (select.selectedType != 'FALSE') {
				html+= " checked='true' ";
			}
			html += "/>" + mt.label + "<br/>";

		}
		$('locationRoles').update(html);
		$('saveLocationMeetingtypesLink').setStyle({display: 'block'});
	};

	function resetLocationMeetingtypeData() {
	};

	// Location time management
	this.savelocationtimes = function() {
		if ($('loc_id').getValue() > 0) {
			resetLocationTimesErrors();
			$('messageText3').innerHTML="Nieuwe tijden worden opgeslagen, even geduld a.u.b.";
			var url='eaa_editlocationopenclose.html?mode=save';
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: $('eaaManagementForm').serialize(true),
					onComplete: procesSaveLocationTimesResult
				}
			);
		}
	};

	this.loadLocationTimes = function() {
		resetLocationMeetingtypeErrors();
		resetLocationErrors();
		resetLocationTimesErrors();
		resetLocationCapacityErrors()
		var url='eaa_editlocationopenclose.html?mode=load';
		switchtab(3);
		if ($('loc_id').getValue() > 0) {
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: $('eaaManagementForm').serialize(true),
					onComplete: showLocationTimes
				}
			);
		}
	};

	function procesSaveLocationTimesResult(request) {
		//set message(s)
		var jsonData = request.responseText.evalJSON();
		var nrErrors = 0;
		for (var j=0; j < jsonData.messages.length; j++) {
			var message = jsonData.messages[j];
			var mType = message.messagetype;
			var mText = message.messagetext;
			if (mType == "error_req" ||
					mType == "error_func") {
				nrErrors++;
				$('error_content3').setStyle({display: 'block'});
				$('errorText3').update(mText);
			}
		}

		//if ok
		if (nrErrors == 0) {
			$('error_content3').setStyle({display: 'block'});
			$('messageText3').update("Openingstijden opgeslagen");
		}

		new Effect.Highlight('error_content3', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 })
	};

	function showLocationTimes(request) {
		var times= request.responseText.evalJSON();
		initAllTimes(times);
	};

	function resetLocationTimesErrors() {
		$('error_content3').setStyle({display: 'none'});
		$('messageText3').update("");
		$('errorText3').update("");
	};

	// General functions
	function initAllTimes(times) {
		var alltimes = times.alltimes;
		var daily = times.dailytimes[0];
		var open = daily.open;
		var close = daily.close;
		initOneDayList($('mo_open'), alltimes, open);
		initOneDayList($('mo_close'), alltimes, close);
		daily = times.dailytimes[1];
		open = daily.open;
		close = daily.close;
		initOneDayList($('tu_open'), alltimes, open);
		initOneDayList($('tu_close'), alltimes, close);
		daily = times.dailytimes[2];
		open = daily.open;
		close = daily.close;
		initOneDayList($('we_open'), alltimes, open);
		initOneDayList($('we_close'), alltimes, close);
		daily = times.dailytimes[3];
		open = daily.open;
		close = daily.close;
		initOneDayList($('th_open'), alltimes, open);
		initOneDayList($('th_close'), alltimes, close);
		daily = times.dailytimes[4];
		open = daily.open;
		close = daily.close;
		initOneDayList($('fr_open'), alltimes, open);
		initOneDayList($('fr_close'), alltimes, close);
		daily = times.dailytimes[5];
		open = daily.open;
		close = daily.close;
		initOneDayList($('sa_open'), alltimes, open);
		initOneDayList($('sa_close'), alltimes, close);
		daily = times.dailytimes[6];
		open = daily.open;
		close = daily.close;
		initOneDayList($('su_open'), alltimes, open);
		initOneDayList($('su_close'), alltimes, close);
	};

	function initOneDayList(selectElement, alltimes, selectedTime) {
		var number = alltimes.length;

		//remove current
		selectElement.length = 0;

		//remove first 0 from selectedtime
		if (selectedTime.charAt(0) == '0') {
			selectedTime = selectedTime.substring(1);
		}

		for (var i = 0; i < number; i++) {
			var time = alltimes[i];
			if (time.time == selectedTime) {
				selectElement.options[selectElement.options.length]=
					new Option(time.time, time.time, false, true);
			} else {
				selectElement.options[selectElement.options.length]=
					new Option(time.time, time.time);
			}
		}

		if (selectedTime == "na") {
			selectElement.value = "kies";
		}
	};

	this.loadlocationcapacity = function() {
		resetLocationMeetingtypeErrors();
		resetLocationErrors();
		resetLocationTimesErrors();
		resetLocationCapacityErrors()

		var url='eaa_editlocationschedule.html?mode=load';
		switchtab(4);
		if ($('loc_id').getValue() > 0) {
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: $('eaaManagementForm').serialize(true),
					onComplete: showLocationCapacity
				}
			);
		}
	};

	function showLocationCapacity(request) {
		//create output lines.
		var html="<table>";
		var capacityText = request.responseText.evalJSON();
		var nodeRows = capacityText.capacity;
		var days = ["time", "ma", "di", "wo", "don", "vr", "za", "zo"];
		for (var j=0; j < nodeRows.length; j++) {
			html+="<tr>";
			var rowWithNodes = nodeRows[j];
			for (var i = 0; i < rowWithNodes.length; i++) {
				var node = rowWithNodes[i];
				if (i == 0) {
					html+="<td class='cap_time'>" + node + "</td>";
				} else {
					if (node == 99) {
						html+="<td><input type='text' size='2' maxlength='2'" +
							" value='0' name='" + days[i] +
							"' class='capnofill' onkeypress='return false;' " +
							"/></td>";
					} else {
						html+="<td><input type='text' size='2' maxlength='2'" +
							" value='" + node + "' name='" + days[i] +
							"' onkeypress='return AllowOnlyNumeric(event)' " +
							"/></td>";
					}
				}
			}
			html+="</tr>";
		}
		html+="</table>";
		$('capacityData').update(html);
	};

	this.savelocationcapacity = function() {
		if ($('loc_id').getValue() > 0) {
			resetLocationCapacityErrors();
			$('messageText4').innerHTML="Bezig met stoelen opslaan, even geduld a.u.b.";
			if (checkContentNotEmpty()) {
				var url='eaa_editlocationschedule.html?mode=save';
				new Ajax.Request
				(
					url,
					{
						method: 'get',
						parameters: $('eaaManagementForm').serialize(true),
						onComplete: procesSaveLocationScheduleResult
					}
				);
			}
		}
	};

	function procesSaveLocationScheduleResult(request) {
		//set message(s)
		var jsonData = request.responseText.evalJSON();
		var nrErrors = 0;
		for (var j=0; j < jsonData.messages.length; j++) {
			var message = jsonData.messages[j];
			var mType = message.messagetype;
			var mText = message.messagetext;
			if (mType == "error_req" ||
					mType == "error_func") {
				nrErrors++;
				$('error_content4').setStyle({display: 'block'});
				$('errorText4').update(mText);
			}
		}

		//if ok
		if (nrErrors == 0) {
			$('error_content4').setStyle({display: 'block'});
			$('messageText4').update("Stoelen per tijd opgeslagen");

		}

		new Effect.Highlight('error_content4', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 })
	};

	function resetLocationCapacityErrors() {
		$('error_content4').setStyle({display: 'none'});
		$('messageText4').update("");
		$('errorText4').update("");
	};

	this.entsub = function(event) {
		if (window.event && window.event.keyCode == 13) {
			return false;
		} else if (event && event.which == 13) {
			return false;
		} else {
			return true;
		}
	};

	this.switchtab = function(tabnr) {
		if (tabnr == 1) {
			resetLocationMeetingtypeErrors();
			resetLocationErrors();
			resetLocationTimesErrors();
			$('tab1box').setStyle({display: 'block'});
			$('tab2box').setStyle({display: 'none'});
			if ( undefined != $('tab3box')) {
				$('tab3box').setStyle({display: 'none'});
			}
			if ( undefined != $('tab4box')) {
				$('tab4box').setStyle({display: 'none'});
			}
		} else if (tabnr == 2) {
			$('tab1box').setStyle({display: 'none'});
			$('tab2box').setStyle({display: 'block'});
			if ( undefined != $('tab3box')) {
				$('tab3box').setStyle({display: 'none'});
			}
			if ( undefined != $('tab4box')) {
				$('tab4box').setStyle({display: 'none'});
			}
		} else if (tabnr == 3) {
			$('tab1box').setStyle({display: 'none'});
			$('tab2box').setStyle({display: 'none'});
			if ( undefined != $('tab3box')) {
				$('tab3box').setStyle({display: 'block'});
			}
			if ( undefined != $('tab4box')) {
				$('tab4box').setStyle({display: 'none'});
			}
		} else if (tabnr == 4) {
			$('tab1box').setStyle({display: 'none'});
			$('tab2box').setStyle({display: 'none'});
			if ( undefined != $('tab3box')) {
				$('tab3box').setStyle({display: 'none'});
			}
			if ( undefined != $('tab4box')) {
				$('tab4box').setStyle({display: 'block'});
			}
		}
	};

	function checkContentNotEmpty() {
		var ma = document.forms[0].ma;
		var di = document.forms[0].di;
		var wo = document.forms[0].wo;
		var don = document.forms[0].don;
		var vr = document.forms[0].vr;
		var za = document.forms[0].za;
		var zo = document.forms[0].zo;
		var days = [ma, di, wo, don, vr, za, zo];
		var result = true;
		var i = 0;
		while (result && i < 7) {
			result = checkDay(days[i]);
			i=i+1;
		}

		if (!result) {
			$('error_content4').setStyle({display: 'block'});
			$('errorText4').update("Vul in alle velden een getal in");

		}
		return result;
	};

	function checkDay(values) {
		if ( undefined != values) {
			var i = 0;
			for (i = 0; i < values.length; i++) {
				var element = values[i];
				if (element.value.length == 0) {
					return false;
				}
			}
		}
		return true;
	};

})();