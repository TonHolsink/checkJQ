(function() {
	var searchBox;
	var state = 0;
	var oldstate = 0;
	var isTelephone = false;
	var ajaxUpdater;
	var changed = false;
	var selectedId = 0;
	var limitedWeekend = false;
	var scrollTop = 0;

	//***** DEBUG ***************************************************
	//var logValue = 0;
	//***************************************************************

	this.setLimitedWeekend = function(lw) {
		limitedWeekend = lw;
	};

	this.locationSelected = function(element) {
		var locationid = element.value;
		var meetingidField = $('meetingid');

		var meetingid;
		var moveState;
		if (undefined != meetingidField) {
			meetingid = $('meetingid').value;
			moveState = $('moveState').value;
		}

		if (locationid != "Kies locatie") {
			var params = $('agendaPage1Form').serialize();
			var url='loadSupplierAgenda.html?loc=' + locationid + '&' + params;
			if (undefined != meetingid && meetingid.length > 0
					&& moveState) {
				url = url + '&moveIndication=1';
			}
			window.location = url;
		}
	};

	this.locationSelectedPage2 = function(element) {
		var locationid = element.value;
		var meetingid = $('meetingid').value;
		var moveState = $('moveState').value;
		if (locationid != "Kies locatie") {
			var params = $('agendaPage1Form').serialize();
			var url='loadSupplierAgenda.html?loc=' + locationid + '&' + params;
			if (undefined != meetingid && meetingid.length > 0 && moveState == true) {
				var errors = checkFormData(1);
				if (errors == 0) {
					url = url + '&moveIndication=1';
					window.location = url;
				}
			} else {
				window.location = url;
			}
		}
	};

	this.doSubmitDetailRequest = function(type, id, timeString, dateString, el) {
		if ((type == 1) && ($('readOnly').getValue() != 'true')) {
			changeSelected(0, selectedId);
			startNewMeeting(timeString, dateString);
		} else if (type == 2) {
			state = 0;
			var url='loadMeetingDetails.html';
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: 'id=' + id,
					onComplete: showMeetingDetails(el)
				}
			);
		}
	};

	this.doSubmitSearch = function(drag) {
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
	};

	//Submits for back and forward links on agenda page
	this.doPageAgendaAction = function(theAction) {
		var div = $("agendaData");
		if (theAction == "init" || theAction =="forward" || theAction == "back") {
			this.scrollTop = 0;
		} else {
			if (div) {
				this.scrollTop = div.scrollTop;
			}
		}

		if (theAction != "reload" && ajaxUpdater) {
			clearInterval(ajaxUpdater);
		}
		var date = $("date").value;
		var locid = document.forms[0].locationID.value;
		var tsField = document.forms[0].timestamp;
		var timestamp = "";
		if (tsField) {
			timestamp = tsField.value;
		}
		var url = 'reloadAgenda.html';
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: {locid: locid, date: date, timestamp: timestamp, action: theAction},
			 	onComplete: showReloadedAgenda
			}
		);
	};

	this.startUpdater = function(meetingid) {
		if (state == 0) {
			state = document.forms[0].state.value;
		}
		if (ajaxUpdater) clearInterval(ajaxUpdater);
		ajaxUpdater = setInterval("doPageAgendaAction('reload')", 60000);

	};

	this.entsub = function(event) {
		if (window.event && window.event.keyCode == 13) {
			doSubmitSearch(0);
			return false;
		} else if (event && event.which == 13) {
			doSubmitSearch(0);
			return false;
		} else	{
			return true;
		}
	};

	//BOTTOM SCRIPTS
	////closure ivm doorgeven element waarop is geklikt
	function showMeetingDetails(el) {
		return function(request) {
			resetMeetingData();
			var meeting = request.responseText.evalJSON();
			//base data
			$('extlocation').update(meeting.extlocation);
			$('state').value = 20;
			state = 20;
			$('goods').value = meeting.goods;
			if (meeting.goods > 0) {
				$('goods').disabled=false;
			}
			if (!meeting.paste) {
				$('date').value = meeting.date;
				$('time').value = meeting.time;
			}
			resetMeetingTypes(meeting.dayNumber);
			$('meetingtype').value = meeting.meetingtype;
			$('channel').value = meeting.channel;
			$('email').value = meeting.email;
			$('name').value = meeting.name;
			$('salutation').value = meeting.salutation;
			$('street').value = meeting.street;
			$('housenumber').value = meeting.housenumber;
			$('postal').value = meeting.postal;
			$('place').value = meeting.place;
			$('dateofbirth').value = meeting.dateofbirth;
			$('phone').value = meeting.phone;
			$('remarks').value = meeting.remarks;
			$('eventlocation').value = meeting.eventlocation;
			var mId = meeting.meetingid;
			$('meetingid').value= mId;
			$('changemotivation').value = meeting.changemotivation;
			var theForm = document.forms[0];
			var changeSource = theForm['changesource'];
			changeSource.value= meeting.changesource;
			if (meeting.emailyesno) {
				$('emailyesno').checked = true;
			} else {
				$('emailyesno').checked = false;
			}
			//Processing data
			$('created').update(meeting.created);
			$('confirmed').update(meeting.confirmed);
			$('userCreated').update(meeting.usercreated);
			$('userLastProcessed').update(meeting.userlastprocessed);
			$('extratime').value=meeting.extratime;
			$('extratimemotivation').value=meeting.extratimemotivation;
			if (meeting.noshow) {
				$('noshow').checked = true;
			} else {
				$('noshow').checked = false;
			}
			$('remarks2').value = meeting.remarks2;

			//toggle delete link, if needed
			if (undefined == meeting.meetingid || meeting.meetingid.length == 0) {
				$('deletelink').setStyle({display: 'none'});
				$('movelink').setStyle({display: 'none'});
			} else {
				$('deletelink').setStyle({display: 'inline'});
				$('movelink').setStyle({display: 'inline'});
			}

			changeSelected(0, selectedId);
			changeSelected(1, mId);
			selectedId = mId;

			handleReadOnly();
			handleRSC3DBlock(el);
		}
	};

	/*
	 * Changes the selected class of the meeting identified by the given id.
	 * Mode = true (1) : set on
	 * false (0) : set off
	 */
	function changeSelected(mode, meetingid) {
		var elements = $$('.' + meetingid);
		elements.each(function(el) {
			if (mode) {
				el.addClassName("selected");
			} else {
				el.removeClassName("selected");
			}
		});
	};

	function showReloadedAgenda(request) {

		var jsonData = request.responseText.evalJSON();
		$("agendaTableDiv").update(jsonData.table);
		$("date").value=jsonData.basedate;

		//Weeknummer alleen zichtbaar voor Beheer
		if ($("weeknumber")) {
			$("weeknumber").update(jsonData.weeknumber);
		}

		changeSelected(1, selectedId);

		var div = $("agendaData");
		if (div) {
			div.scrollTop = this.scrollTop;
		}

		var action = jsonData.action;
		startUpdater();
	};

	function showSupplierAddresses(request) {
		var jsonData = request.responseText.evalJSON();

		//iterate over json data and create markers from that
		$('location').length = 0;
		$('location').options[0] = new Option("Kies locatie", "Kies locatie");
		for (var j=0; j < jsonData.locationsDropDown.length; j++) {

			var location = jsonData.locationsDropDown[j];
			var id = location.value;
			var name = location.label;
			var anOption = new Option(name, id);
			$('location').options[j+1] = anOption;

		}
		handleState(jsonData);
	};

	// performs actions based on state
	function handleState(jsonData) {
		//alert("state = " + state);
		if (state == 0) {
			//Fill meeting drop down list
			for (var j=0; j < jsonData.meetingtypes.length; j++) {
				//Temporary patch in order to ignore 3D meeting types
				if (jsonData.meetingtypes[j].label.toUpperCase().indexOf('M - 3D ') > -1) {
					continue;
				}
				//End patch

				var mt = jsonData.meetingtypes[j];
				var label = mt.label;
				var value = mt.value;
				var anOption = new Option(label, value);
				$("meetingtype").insert(anOption);
			}
			//Open meeting type block
			$("meetingtype_row").setStyle({display: 'block'});
			$('meetingtype').value="0";
			state = 1;
		} else if (state == 1) {
			$("date_row").setStyle({display: 'block'});
			$("time_row").setStyle({display: 'block'});
			$('time').value = "0";
			state=2;
			return;
		} else if (state == 2) {
			for (var j=0; j < jsonData.times.length; j++) {
				var time = jsonData.times[j];
				var label = time.label;
				var value = time.value;
				var anOption = new Option(value, label);
				$("time").options[j] = anOption;
			}
			$("date_row").setStyle({display: 'block'});
			$("time_row").setStyle({display: 'block'});
			$('time').value = "0";
			state=3;
		} else if (state == 3) {

		}

		document.forms[0].state.value=state;
	};

	this.meetingTypeSelected = function() {
		state = 1;
		var url='getPhoneYesNo.html';
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: $('agendaPage1Form').serialize(true),
			 	onComplete: handleIsPhoneReturn
			}
		);
	};

	function handleIsPhoneReturn(request) {
		var jsonData = request.responseText.evalJSON();
		var isTelephone = jsonData.telephone;
		if (isTelephone) {
			var posxy = findPos($("eaarightBottom"));
			var telDiv = $("telephone_row");
			telDiv.setStyle({
				left: (posxy[0] - 100) + 'px',
				top: (posxy[1] + 20) + 'px',
				display: 'block'
			});
		} else {
			showGoodsOrDate();
		}

		state = 2;
	};

	function showGoodsOrDate() {
		var selectedMT = $('meetingtype').value;
		var goods = selectedMT.substring(0,1);
		if (goods == 'Y') {
			$("goods_row").setStyle({display: 'block'});
		} else {
			$("goods_row").setStyle({display: 'none'});
			$("telephone_row").setStyle({display: 'none'});
			$("time_row").setStyle({display: 'none'});
			$("nextstep").setStyle({display: 'none'});
			document.forms[0].date.value='';
			document.forms[0].time.value='';
			$("date_row").setStyle({display: 'block'});
		}
	};

	this.goodsSelected = function() {
		$("telephone_row").setStyle({display: 'none'});
		$("time_row").setStyle({display: 'none'});
		document.forms[0].date.value='';
		document.forms[0].time.value='';
		$("date_row").setStyle({display: 'block'});
	};

	this.meetingTypePage2Selected = function() {
		var selectedMT = $('meetingtype').value;
		var goods = selectedMT.substring(2,3);
		if (goods == 'Y') {
			$("goods").disabled=false;
		} else {
			$("goods").disabled=true;
			$("goods").value = '-';
		}
	};

	this.timeSelected = function() {
		$('nextstep').setStyle({display: 'block'});
		doSubmitSearch(0);
	};

	function startNewMeeting(time, date) {
		//fill time
		resetMeetingData();
		state = 10;
		$('time').value = time;
		$('date').value = date;
		startUpdater(0);
		checkPasteLink();

		var dateString = date.substring(3,5) + "/" + date.substring(0,2) + "/" + date.substring(6);
		var theDate = new Date(dateString);
		var dayNr = theDate.getDay();
		resetMeetingTypes(dayNr);
	};

	function resetMeetingData() {
		$('extlocation').update("");
		$('tabnr').value = "";
		$('goods').value="-";
		$('goods').disabled=true;
		$('meetingtype').value="Y#N#0";
		$('channel').value="0";
		if ($('moveState').value != 'true') {
			$('date').value="";
			$('time').value="0";
		}
		$('salutation').value="";
		$('name').value="";
		$('street').value="";
		$('housenumber').value="";
		$('postal').value="";
		$('place').value="";
		$('dateofbirth').value="";
		$('email').value="";
		$('eventlocation').value="";
		$('phone').value="";
		$('remarks').value="";
		$('meetingid').value = "0";
		$('emailyesno').checked = false;
		$('changemotivation').value = "";
		var theForm = document.forms[0];
		var changeSource = theForm['changesource'];
		changeSource.value="";

		//page 2
		$('created').update("");
		$('confirmed').update("");
		$('userCreated').update("");
		$('userLastProcessed').update("");
		$('extratime').value="";
		$('extratimemotivation').value="";
		$('noshow').checked=false;
		$('remarks2').value="";

		$('savelink').setStyle({display: 'inline'});
		$('deletelink').setStyle({display: 'none'});
		$('movelink').setStyle({display: 'none'});
		$('pastelink').setStyle({display: 'none'});
		$('error_content').setStyle({display: 'none'});
		$('errorText').update('');
		$('messageText').update('');
		$('error_content2').setStyle({display: 'none'});
		$('errorText2').update('');
		$('messageText2').update('');
		$('state').value="0";

		state = 0;
		changed = false;
	};

	this.savemeeting = function(tabnr) {
		resetErrors(tabnr);
		$('tabnr').value = tabnr;
		var errors = checkFormData(tabnr);

		if (errors == 0) {
			/* New by Jakko : block new submits while the meeting is being saved */
			$('savelink').setStyle({display: 'none'});
			$('error_content').setStyle({display: 'block'});
			$('messageText').update("Moment geduld a.u.b...");
			$('errorText').update('');
			$('error_content2').setStyle({display: 'block'});
			$('errorText2').update('');
			$('messageText2').update("Moment geduld a.u.b...");

			var url='afspraakOpslaan.html';
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: $('agendaPage1Form').serialize(true),
				 	onComplete: processSaveMeetingResult
				}
			);
		}
	};

	this.deletemeeting = function() {
		var DoConfirm = confirm("Weet u zeker dat u de geselecteerde afspraak wilt verwijderen?");
		if (DoConfirm) {
			deletemeetingYes();
		}
	};

	function deletemeetingYes() {
		var url='afspraakVerwijderen.html';
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: "meetingID=" + $('meetingid').value,
				onComplete: processRemoveMeetingResult
			}
		);
	};

	this.movemeeting = function() {
		changed = true;
		resetErrors(1);
		var errors = checkFormData(1);
		if (errors == 0) {
			//show move popup
			$('movepopup').setStyle({display: 'block'});
			$('moveState').value = true;
		}
	};

	this.closeMove = function() {
		$('movepopup').setStyle({display: 'none'});
	};

	function checkPasteLink() {
		var moveState = $('moveState').value;
		if (moveState == 'true') {
			$('pastelink').setStyle({display: 'inline'});
		}
	};

	this.pastemeeting = function() {
		var id = -1;
		doSubmitDetailRequest(2, id, "", "");
	};

	function checkFormData(tabnr) {
		var errors = 0;
		if ($('channel').value == '0') {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Kies een wijze van afspraak maken!');
		} else if ($('meetingtype').value == 'Y#N#0') {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Kies een afspraaktype!');
		} else if ($('date').value == '') {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Kies een datum!');
		} else if ($('time').value == 0) {
			errors++;
			$('error_content').setStyle({display: 'block'});
			$('errorText').update('Kies een tijd!');
		} else if (!v_email($('email'), false)){
			errors++;
		} else if (changed &&
				$('meetingid').value != "0" &&
				$('meetingid').value != "") {
			if ($RF(document.forms[0], 'changesource') != 'C' && $RF(document.forms[0], 'changesource') != 'S') {
				errors++;
				$('error_content').setStyle({display: 'block'});
				$('errorText').update('Vul de aanvrager van de wijziging in.');
			} else if ($('changemotivation').value == '') {
				errors++;
				$('error_content').setStyle({display: 'block'});
				$('errorText').update('Geef een reden voor de datum/tijd wijziging.');
			}

		}
		if (errors > 0) {
			new Effect.Highlight('error_content', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 });
		}
		return errors;
	};

	function resetErrors(tabnr) {
		if (tabnr == 1) {
			$('messageText').update("");
			$('errorText').update("");
		} else if (tabnr ==2) {
			$('messageText2').update("");
			$('errorText2').update("");
		}
	};

	function processSaveMeetingResult(request) {
		//show save link again
		$('savelink').setStyle({display: 'inline'});

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
				$('messageText').update("");
				$('messageText2').update("");
				$('error_content').setStyle({display: 'block'});
				$('errorText').update(mText);
				$('error_content2').setStyle({display: 'block'});
				$('errorText2').update(mText);
				new Effect.Highlight('error_content', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 });
				new Effect.Highlight('error_content2', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 });
			}
		}

		//if ok
		if (undefined != jsonData.askPushThrough && jsonData.askPushThrough == 'yes') {
			$('pushThrough').setStyle({display: 'block'});
			var ptm = 'pushThroughMessage' + jsonData.timeHorizon;
			$(ptm).setStyle({display: 'block'});
		} else if (nrErrors == 0) {
			var meetingid = jsonData.meetingid;
			$('meetingid').value = meetingid;
			$('error_content').setStyle({display: 'block'});
			$('messageText').update("Afspraak opgeslagen");
			$('errorText').update('');
			$('error_content2').setStyle({display: 'block'});
			$('errorText2').update('');
			$('messageText2').update("Afspraak opgeslagen");
			new Effect.Highlight('error_content', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 });
			new Effect.Highlight('error_content2', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 });
			doPageAgendaAction("save");
			changeSelected(0, selectedId);
			changeSelected(1, meetingid);
			selectedId = meetingid;
		}

		if (jsonData.pasteresult) {
			$('moveState').value = 'false';
		}
	};

	this.pushThrough = function(choice) {
		$('pushThrough').setStyle({display: 'none'});
		if (choice == 'y') {
			$('pushthrough3days').value='true';
			savemeeting(1);
		}
	};

	function processRemoveMeetingResult(request) {
		var jsonData = request.responseText.evalJSON();

		if (jsonData.deleted == "yes") {
			resetErrors(1);
			resetMeetingData();
			$('error_content').setStyle({display: 'block'});
			$('messageText').update("Afspraak verwijderd");
			$('error_content2').setStyle({display: 'block'});
			$('messageText2').update("Afspraak verwijderd");

			doPageAgendaAction("remove");
		} else {
			//add a message that deletion didn't work
			$('error_content').setStyle({display: 'block'});
			$('messageText').update("Er is een fout opgetreden");
			$('error_content2').setStyle({display: 'block'});
			$('messageText2').update("Er is een fout opgetreden");
		}

		handleReadOnly();
	};

	this.switchtab = function(tabnr) {
		if (tabnr == 1) {
			var temp = oldstate;
			state = oldstate;
			$('state').value=state;
			oldstate = temp;
			$('tab2box').setStyle({display: 'none'});
			$('tab1box').setStyle({display: 'block'});
		} else if (tabnr == 2) {
			oldstate = state;
			$('state').value="30";
			state = 30;
			$('tab1box').setStyle({display: 'none'});
			$('tab2box').setStyle({display: 'block'});
		}
	};

	this.closeTelephone = function() {
		$('telephone_row').setStyle({display: 'none'});
		showGoodsOrDate();
		state=2;
	};

	this.openTelephoneAgenda = function() {
		var params = $('agendaPage1Form').serialize();
		var url='loadSupplierAgenda.html?loc=telephone' + '&' + params;
		//what to do here?
		window.location = url;
	};

	this.openHoverMsg = function(msg) {
		$('hovertext').update(msg);
		$('hoverpopup').setStyle({display: 'block'});
	};

	this.openHover = function(id, meetingname, customername, locationname, e) {
		var msg = meetingname + "<br/>" + "Naam: " + customername + "<br/>" + "Locatie: " + locationname;
		this.openHoverMsg(msg);
	};

	this.openHover3dBlock = function() {
		var msg = "Tijdstip is niet beschikbaar vanwege capaciteit Bedienstudio RSC";
		this.openHoverMsg(msg);
	};

	this.closeHover = function() {
		$('hovertext').update("");
		$('hoverpopup').setStyle({display: 'none'});
	};

	this.openOverview = function() {
		var location = document.forms[0].locationID.value;
		var searchDate = $('overviewDate').value;
		window.open('dailyOverview.html?locationID=' + location + "&overviewDate=" + searchDate,'Popup','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=1000,height=620,left=200,top=100');
	};

	this.page2TimeChanged = function() {
		if ($('meetingid').value != "0" &&
			!(undefined == $('meetingid').value) &&
			$('meetingid').value != "") {
			changed = true;
		}
	};

	this.page2DateChanged = function(year, month, day) {
		if ($('meetingid').value != "0" &&
				!(undefined == $('meetingid').value) &&
				$('meetingid').value != "") {
			changed = true;
		}

		document.forms[0].date.value=day + '/' + month + "/" + year;
		var theDate = new Date(month + '/' + day + '/' + year);
		resetMeetingTypes(theDate.getDay());
	};

	/**
	 * Call the backend to retrieve a street/place combi.
	 */
	this.getAddress = function() {
		var postalCode = $('postal').value;
		var houseNumber = $('housenumber').value;
		if (postalCode != '' && houseNumber != '') {
			if (postalCode.length == 6) {
				var url='retrieveAddress.html';
				new Ajax.Request
				(
					url,
					{
						method: 'get',
						parameters: 'postal=' + postalCode + "|" + houseNumber,
					 	onComplete: setAddress
					}
				);
			}
		}
	};

	/**
	 * Process the result of the call to the address retrieval.
	 */
	function setAddress(request) {
		var jsonData = request.responseText.evalJSON();
		var error = jsonData.error;
		if (error == '') {
			var street = jsonData.street;
			var place = jsonData.place;
			if (street != undefined && place != undefined) {
				$('street').value = street;
				$('place').value = place;
			}
		} else {
			$('street').value = "";
			$('place').value = "";
		}
	};

	this.v_email = function(element, setEmailYesNo) {
		var formField = element;
		if (formField.value != "") {
			var filter=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if (!filter.test(formField.value)) {
				$('error_content').setStyle({display: 'block'});
				$('errorText').update('Het emailadres is niet correct.');
				new Effect.Highlight('error_content', { startcolor: '#BE9E55',	endcolor: '#ffffff', duration: 2 });
				$('emailyesno').checked=false;
				return false;
			}
		}

		if (setEmailYesNo) {
			$('emailyesno').checked=true;
		}
		return true;
	};

	/*
	 * We store the meetingtypes in a list upon loading this page. Reason is
	 * that, if necessary, we want to be able to filter out only the meetings
	 * that can be planned in the weekend.
	 */
	var meetingTypes = new Array();
	this.initMeetingTypeList = function() {

		var selObj = $('meetingtype');
		var i;
		for (i=0; i<selObj.options.length; i++) {
			var option = selObj.options[i];
			var value = option.value;
			var label = option.text;
			var restricted = value.substring(0,1);

			var mt = new Object();
			mt.option = option;
			mt.restricted = restricted;
			mt.label = label;
			mt.value = value;
			meetingTypes[i] = mt;
		}
	};

	function resetMeetingTypes(dayNr) {
		var theList = $('meetingtype').options;
		theList.length = 0;
		if (limitedWeekend && (dayNr == 0 || dayNr == 6)) {
			var i;
			for (i = 0; i<meetingTypes.length; i++) {
				var mt = meetingTypes[i];
				if (mt.restricted == "Y") {
					theList[theList.length] = mt.option;
				}
			}
		} else {
			var i;
			for (i = 0; i<meetingTypes.length; i++) {
				var mt = meetingTypes[i];
				theList[theList.length] = mt.option;
			}
		}
		theList.selectedIndex = 0;
	};

	/**
	 * Handles the readonly state of the interface
	 */
	this.handleReadOnly = function() {
		if ($('rsc3D').getValue() == 'true') {
			$('extlocation_row').removeClassName('hidden');
		}

		if ($('readOnly').getValue() == 'true') {
			$('tabs').hide();
			$('submit_row').addClassName('visibility_hidden');
			$('submit_row2').addClassName('visibility_hidden');

			$$("#eaaright input").each(function(el) {
				el.disable();
			});
			$$("#eaaright select").each(function(el) {
				el.disable();
			});
			$$("#eaaright textarea").each(function(el) {
				el.disable();
			});
		}
	};

	/**
	 * Allows blockades to be deleted in the readonly rsc3d agenda by showing the submit row
	 */
	function handleRSC3DBlock(el) {
		if ($('rsc3D').getValue() == 'true' && el.hasClassName('content_blocked')) {
			$('submit_row').removeClassName('visibility_hidden');
		}
	};

})();