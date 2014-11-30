var TASK = TASK ? TASK : {
	admin: false, //Makes sure that certain fields and links are not referenced in javascript,
	  //when they are not available when the form is read only.
	  //Is set in the jsp file. 
	detailFields: {}, //Container of the taskDetail fields
	detailFieldsVal: {}, //Container of the original values of the taskDetail fields
	buttons_click: {}, //Container for the onclick events of the buttons.
	task_timer_running: false, //Controls the taskDetail timer
	stop_timer: true, //Stops the taskDetail timer
	DETAILURL : "loadTaskDetail.html",
	DETAILURL2 : "loadTaskDetail2.html",
	RELOADTASKSURL : "reloadTasks.html",
	CHECKDAYSTATEURL : "checkDayState.html",
	DAILYOVERVIEWURL : "taskDayList.html",
	TIMERINTERVAL : 15 * 60, //The interval of the timer
	/**
	 * Shows a daily overview 
	 */
	openOverview: function() {
		var form = $("taskForm");
		var location = $F(form["locationID"]);
		var searchDate = $F(form["overviewDate"]);
		var url = TASK.DAILYOVERVIEWURL + '?locationID=' + location + "&overviewDate=" + searchDate;
		window.open(url ,'Popup','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=1000,height=620,left=200,top=100');
	},
	
	scrollIntoView: function() {
		var form = $("taskDetailForm");
		var taskID = 0;
		if (form) taskID = $F(form["id"]);
		if (taskID > 0) {
			var el = $("tr_" + taskID);
			if (el) {
				el.addClassName("scroller_selected").scrollIntoView(false);
			}
		}
	},
	
	//Submits for back and forward links on agenda page
	reloadTasks : function(theAction) {
//		ajaxUpdater.stop();
//		ajaxUpdater = "test";
		var form = $("taskForm");
		var date = $F(form["weekDate"]);
		var locid = $F(form["locationID"]);
		var params = "locid=" + locid +
					 "&date=" + date +
					 "&action=" + theAction;
		var url=TASK.RELOADTASKSURL;
		new Ajax.Request
		(
			url,
			{
				method: 'get',
				parameters: params,
			 	onComplete: function(request) {
			    	var items = request.responseText;
				  	var jsonData = eval('(' + items + ')');
				  	form["weekDate"].setValue(jsonData.weekDate);
					$("taskScroller").update(jsonData.table);
					TASK.scrollIntoView();
				}
			}
		);
	},
  
	//TODO: Updater starten
	showReloadedTasks : function(request) {
		$("taskScroller").update(request.responseText);
//    	var items = request.responseText;
//	  	var jsonData = eval('(' + items + ')');
//    	document.getElementById("agendaTableDiv").innerHTML = jsonData.table;
//    	document.getElementById("date").value=jsonData.basedate;
//    	startUpdater();
    },
    
	
	/**
	 * Callback function of the taskDetail timer
	 * Enables the save and escape button
	 * Disables the delete and add button
	 * @param element The field which changed
	 */
	detailChanged: function (element) {
		if (TASK.stop_timer == false) {;
			TASK.toggleButton($("save_button"), true);
			TASK.toggleButton($("escape_button"), true);
//			TASK.toggleButton($("delete_button"), false);
			//Je mag niet toevoegen
			TASK.toggleButton($("add_button"), false);
		}
	},
	/*
	 * Toggles the state of a button (active or inactive)
	 * When deactivated, the onclick function of the button is stored
	 * The onclick function is restored upon activation.
	 * @param btn The button to toggle
	 * @param on true to activate, false to deactivate
	 */
	toggleButton: function (btn, on) {
		if (btn) { //button has to exist
			if (on) {
				btn.onclick = TASK.buttons_click[btn.id];
				btn.removeClassName("button_inactive");
				btn.addClassName("button_active");
			} else {
				TASK.buttons_click[btn.id] = btn.onclick;
				btn.onclick = null;
				btn.removeClassName("button_active");
				btn.addClassName("button_inactive");
			}
		}
	},
	/*
	 * Called on completion of the Ajax-call in setDetail
	 * It initializes the form.
	 * It stores all the inputs and values of the inputs in containers.
	 * This way the timer functions can determine if the value has changed.
	 * The initial state of the buttons is taken care off.
	 * @param todo The action to undertake
	 */
	start: function (todo) {
		var form = $("taskDetailForm");

		TASK.task_timer_running = false;
		TASK.stop_timer = true;
		//Only admins
//		alert("TASK.admin = " + TASK.admin);

		//This way all the click events are stored
		$$("span.button").each(function(btn) {
			TASK.toggleButton(btn, false);
		});

		//De dag van de week wordt onzichtbaar gemaakt
		$("dow_row").addClassName("hidden");

		if (TASK.admin == true) {
			
			if ($F(form["id"]) == 0) {
				$("date_ro_row").addClassName("hidden");
				$("date2_row").addClassName("hidden");
			} else {
				$("date_row").addClassName("hidden");
			}

			TASK.detailFields = $$("input#name");			
			TASK.detailFields[TASK.detailFields.length]= $("firstnames");
			TASK.detailFields[TASK.detailFields.length]= $("birthdate");
			TASK.detailFields[TASK.detailFields.length]= $("birthplace");
			TASK.detailFields[TASK.detailFields.length]= $("street");
			TASK.detailFields[TASK.detailFields.length]= $("housenumber");
			TASK.detailFields[TASK.detailFields.length]= $("place");
			TASK.detailFields[TASK.detailFields.length]= $("postal");
			TASK.detailFields[TASK.detailFields.length]= $("ssn");
			TASK.detailFields[TASK.detailFields.length]= $("startDate");
			TASK.detailFields[TASK.detailFields.length]= $("occurrences");
			TASK.detailFields[TASK.detailFields.length]= $("email");
			//Textarea has to be manually added
			TASK.detailFields[TASK.detailFields.length]= $("remarks");
			
			//Select has to be manually added
			TASK.detailFields[TASK.detailFields.length]= $("startTime");
			TASK.detailFields[TASK.detailFields.length]= $("endTime");
			TASK.detailFields[TASK.detailFields.length]= $("dayOfWeek");
			TASK.detailFields[TASK.detailFields.length]= $("interval");

			if (todo.toUpperCase() != "ERROR") {
				TASK.toggleButton($("add_button"), true);
			}
			
			if (todo.toUpperCase() == "DETAIL") {
				TASK.toggleButton($("stop_button"), true);
				TASK.toggleButton($("complete_button"), true);
			}
			
			//In case of an error, disable the scroller
			if (todo.toUpperCase() == "ERROR") {
				TASK.toggleButton($("save_button"), true);
				TASK.toggleButton($("escape_button"), true);
				TASK.disableScroller();
			}
		} else {
			$("date_row").addClassName("hidden");
			$("button_row").addClassName("hidden");

			if (todo.toUpperCase() == "DETAIL") {
				TASK.toggleButton($("complete_button"), true);
			}
		}
	},
	/*
	 * Disables the scroller by setting all the onclick events to null
	 */
	disableScroller: function () {
		$$("div.taskScroller tr").each(function(el) {
			el.onclick = null;
		});
	},
	
	checkDayState: function() {
		var form = document.forms[0];
		var locid = $F(form["locationInit"]);
		if (locid != "Kies locatie") {
			var params = "locid=" + locid;
			var url = TASK.CHECKDAYSTATEURL;
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: params,
				 	onComplete: function(request) {
	
						var items = request.responseText;
					  	var jsonData = eval('(' + items + ')');
					  	var state = jsonData.state;
				  		var el = $("btn_taak");
					  	if (state > 10)
					  		el.addClassName("rb_alarm");
					  	else
					  		el.removeClassName("rb_alarm");
					}
				}
			);
		}
	},
	
	startTaskTimer: function() {
		new PeriodicalExecuter(function(pe) {
			TASK.checkDayState();
			if ($("taskScroller"))
				TASK.reloadTasks();
		}, TASK.TIMERINTERVAL);
	},
	/*
	 * Stores all the values of the taskDetail fields
	 * and starts the timer.
	 */
	initTaskDetail: function () {
		//Alleen de admin kan wijzigen
		if (TASK.admin) {
			if (!TASK.task_timer_running) {
				TASK.detailFields.each(function(el) {
	//				alert(el.name + " = " + el.type);
					if (el.type == "checkbox") {
						TASK.detailFieldsVal[el.name] = el.checked;
					} else {
						TASK.detailFieldsVal[el.name] = el.value;
					}
				});
	//			TASK.dumpDetailFields();

				new PeriodicalExecuter(function(pe) {
					TASK.detailFields.each(function(el) {
						if (el.type == "checkbox") {
							if (el.checked != TASK.detailFieldsVal[el.name]) {
								TASK.detailChanged(el);
								pe.stop();
							}
						} else if (el.value != TASK.detailFieldsVal[el.name]) {
							TASK.detailChanged(el);
							pe.stop();
						}
					});
				}, 0.3);
				TASK.task_timer_running = true;
				TASK.stop_timer = false;
			}
		}
	},

	dumpDetailFields: function () {
		var s = "";
		TASK.detailFields.each(function(el) {
			s += el.name + "=" + TASK.detailFieldsVal[el.name] + "\n";
		});
		alert(s);
	},

	showTasks : function() {
		var locationid = $('locationInit').value;
		if (locationid != "Kies locatie") {
			var url='loadTasks.html?loc=' + locationid;
			window.location.href = url;
		}
	},
	
	showAppointments : function(el) {
		var locationid = el.value;
		if (locationid != "Kies locatie") {
			var url='loadSupplierAgenda.html?loc=' + locationid;
			window.location.href = url;
		}
	},
	/**
	 * Clears struts messages
	 */
	clearStrutsMessages: function() {
		var messageBlock = $$("div#messageBlock");
		if (messageBlock) {
			messageBlock[0].update("");
		}
	},
	
	getDetail: function(el, id, locationID, weekDate, todo) {
		//Clears struts messages
		TASK.clearStrutsMessages();

		var queryString = "todo=" + todo + "&id=" + id + "&locationID=" + locationID + "&weekDate=" + weekDate;
		TASK.setDetail(queryString);
		$$("table#taskTbl .scroller_selected").each(function(row) {
			row.removeClassName("scroller_selected");
		});
		
		if (id > 0) {
			$(el).addClassName("scroller_selected");
		}
	},
	
	setDetail: function(queryString) {
		var url = TASK.DETAILURL + "?" + queryString.unescapeHTML();
		var todo = url.toQueryParams().todo;
		var div = $("eaaright");
		new Ajax.Request(url, {
			method: 'get',
			onSuccess: function(transport) {
				div.update(transport.responseText || "Geen respons! Status = " + transport.status);
			},
			onComplete: function() {
				TASK.start(todo);
			},
			onFailure: function() {
				div.update("Er is iets misgegaan..");
			}
		});			
	},
	
	stopTask: function (message) {
		if (confirm(message)) {
			TASK.clearStrutsMessages();
			var form = $("taskDetailForm");
			var todo = "STOP";
			form.action = TASK.DETAILURL2 + "?todo=" + todo;
			form.submit();
		}
	},
	
	newTask: function () {
		TASK.showTasks();
	},
	
	saveTask: function (message) {
		var form = $("taskDetailForm");
		var id = $F(form["id"]);
		//d.d. 25-1-2012 iom Bas geen toestemming om wijzigingen op te slaan
		//if ((id == 0) || (confirm(message))) {} //Alleen bij gewijzigde taken vraag stellen
		if (TASK.validateTask()) {
			TASK.clearStrutsMessages();
			var form = $("taskDetailForm");
			var todo = "SAVE";
			//Check op changeAll alleen als het een bestaande taak is
			//met meerdere occurrences
			//als een van de velden "startTime", "endTime", "dayOfWeek" is gewijzigd
			if (($F(form["occurrences"]) > 1) && ($F(form["id"]) > 0)) {
				var fieldsToCheck = ["startTime", "endTime", "dayOfWeek", "interval"];
				var input = fieldsToCheck.find(function(el) {
					var f = $(el);
					return ($F(f) != TASK.detailFieldsVal[f.name]);
				});
				//Er zijn velden gewijzigd
				if (input) {
					if (input == "interval") {
						todo="SAVECHANGEALL";
					} else {
						if (confirm("Geldt de wijziging in dag en/of tijdstip voor alle toekomstige taken?")) {
							todo="SAVECHANGEALL";
						}
					}
				}
			}
			form.action = TASK.DETAILURL2 + "?todo=" + todo;
			form.submit();
		}
	},
	
	completeTask: function (message) {
		if (confirm(message)) {
			if (TASK.validateTask()) {
				TASK.clearStrutsMessages();
				var form = $("taskDetailForm");
				var action = TASK.DETAILURL2 + "?todo=COMPLETE";
				form.action = action;
				form.submit();
			}
		}
	},
	
	escapeTask: function () {
		var form = $("taskDetailForm");
		var id = $F(form["id"]);
		var locationID = $F(form["locationID"]);
		var weekDate = $F(form["weekDate"]);
		var action = TASK.DETAILURL2 + "?id =" + id + "locationID=" + locationID + "&weekDate=" + weekDate + "&todo=ESCAPE";
		form.action = action;
		form.submit();
	},
	
	isBlank: function(field, name) {
		var form = $("taskDetailForm");
		var input = form[field];
		if ($F(input).blank()) {
			alert("Er is geen " + name + " ingevuld!");
			input.focus();
			return true;
		}
		return false;
	},
	
	validateTask: function() {
		var form = $("taskDetailForm");
		//TODO: Implementeren
		if (TASK.isBlank("name", "achternaam")) return false;
		if (TASK.isBlank("firstnames", "voornaam")) return false;
		if (TASK.isBlank("birthdate", "geboortedatum")) return false;
		if (TASK.isBlank("birthplace", "geboorteplaats")) return false;
		if (TASK.isBlank("ssn", "bsn")) return false;
		if (TASK.isBlank("postal", "postcode")) return false;
		if (TASK.isBlank("housenumber", "huisnummer")) return false;
		if (TASK.isBlank("street", "adres")) return false;
		if (TASK.isBlank("place", "plaats")) return false;
		if (TASK.isBlank("startDate", "startdatum")) return false;
		
		var input = form["email"];
		if (TASK.v_email(input) == false) {
			alert("Dit is geen correct email adres!");
			input.focus();
			return false;
		}
		
		input = form["birthdate"];
		if(YRDATE.isDate($F(input)) == false) {
			input.focus();
			return false;
		}
		
		input = form["startDate"];
		if(YRDATE.isDate($F(input)) == false) {
			input.focus();
			return false;
		}
		
		//Alleen voor nieuwe taken mag de startdatum niet in het verleden liggen
		var id = $F(form["id"]);
		if ((id == 0) && (TASK.checkDateInPast($F(input)) == true)) {
			alert("De datum van de eerste afspraak mag niet in het verleden liggen!");
			input.focus();
			return false;
		}

		input = form["startTime"];
		if ($F(input) == "0") {
			alert("Er moet een starttijd worden gekozen!");
			input.focus();
			return false;
		}
		//Controle endTime > startTime
		if (TASK.time1GtrTime2($F(form["endTime"]), $F(form["startTime"])) == false) {
			alert("De eindtijd moet groter zijn dan de starttijd!");
			form["endTime"].focus();
			return false;
		}
		
		
		var occ = $F(form["occurrences"]);
		if (TASK.validateIntGrtrZero(occ) == false) {
			alert("Het aantal keer moet een geheel getal zijn groter dan 0!");
			input.focus();
			return false;
		}
		//Als de periodiciteit = geen (eenmalige taak), dan moet het aantal keer = 1
		var ival = $F(form["interval"]);
		if ((ival == "0") && (occ != "1")) {
			alert("Bij een eenmalige taak (periodiciteit = geen) moet het aantal keer gelijk zijn aan 1!");
			form["occurrences"].focus();
			return false;
		}
		//Als de periodiciteit > geen (herhaalde taak), dan moet het aantal keer > 1
		if ((ival != "0") && (occ == "1")) {
			alert("Bij een herhaalde taak moet het aantal keer groter zijn dan 1!");
			form["occurrences"].focus();
			return false;
		}
		
		return true;
	},
	/**
	 * Calculates midnight from a dateString
	 * @param dateString as "dd/mm/yy" or "dd-mm-yy" string
	 * @returns midnight in milliseconds since milliseconds from 01 January, 1970 00:00:00 Universal Time (UTC)
	 */
	midnight: function(dateString) {
		var s = dateString.replace(/-/g, "/").split("/");
		var d = new Date();
		d.setHours(0,0,0,0);
		//Gelukkig lopen de maanden van 0 - 11
		//De dagen beginnen daarentegen niet bij nul
		return d.setFullYear(s[2], s[1]-1, s[0]);
	},
	/**
	 * Checks if fromDate >= toDate
	 * @param fromDateString fromDate as "dd/mm/yy" or "dd-mm-yy" string
	 * @param toDateString toDate as "dd/mm/yy" or "dd-mm-yy" string
	 * @returns true if toDate >= fromDate
	 */
	checkDate: function (fromDateString, toDateString) {
		return (TASK.midnight(toDateString) >= TASK.midnight(fromDateString));
	},
	/**
	 * Checks if fromDate is in the future
	 * @param fromDateString fromDate as "dd/mm/yy" or "dd-mm-yy" string
	 * @returns true if fromDate > today
	 */
	checkDateInFuture: function (fromDateString) {
		return (TASK.midnight(fromDateString) > new Date());
	},
	/**
	 * Checks if date is in the past
	 * @param dateString date as "dd/mm/yy" or "dd-mm-yy" string
	 * @returns true if date < today
	 */
	checkDateInPast: function (dateString) {
		var d = new Date();
		//De maand loopt van 0-11!!!!!
		var s = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
		return (TASK.midnight(dateString) < TASK.midnight(s));
	},
	/**
	 * Checks if time1 is greater than time2
	 * @param timeS1 time1 as string in hh:mm format
	 * @param timeS2 time2 as string in hh:mm format
	 * @returns {Boolean} true if time1 is greater than time2 
	 */
	time1GtrTime2: function(timeS1, timeS2) { 
		var t1 = timeS1.split(":");
		var t2 = timeS2.split(":");
		var d = new Date();
		var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t1[0], t1[1]);
		var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t2[0], t2[1]);

		return(d1 > d2);
	},
	/**
	 * Validation for an integer > 0
	 * @param v The value
	 * @returns true if the value is ok.
	 */
	validateIntGrtrZero: function(v) {
		var intFormat = /^[1-9]{1,}[0-9]*$/;
		if (!intFormat.test(v)) {
			return false;
		}
		return true;
	},
	/**
	 * Call the backend to retrieve a street/place combi. 
	 */
	getAddress: function() {
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
					 	onComplete: TASK.setAddress
					}
				);
			}	
		}
	},
	
	/**
	 * Process the result of the call to the address retrieval. 
	 */
	setAddress: function(request) {
	  	var pcData = request.responseText;
	    var jsonData = eval('(' + pcData + ')');
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
	},

	/*
	 * Allows only a numeric value. If a non-numeric value key is pressed, dismiss it.
	 */
	allowOnlyNumeric: function(evt)
	{
	   var key = 0;
	 	
	   // Get the ASCII value of the key that the user entered
	   if (window.event) {
	   	key = window.event.keyCode;
	   } else if (evt) {
	   	key = evt.which;
	   }

	    // Verify if the key entered was a numeric character (0-9) or a decimal (.)
	    if ((key > 47 && key < 58) || key < 32) 
	        // If it was, then allow the entry to continue
	        return;
	    else
	        // If it was not, then dispose the key and continue with entry
	    	return false;
	},

	v_email: function(input) {
		var value = $F(input);
		if (value.blank() == false) {
			var filter=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if (!filter.test(value)) {
				return false;
			}
		} 
		return true;
	},
	
    entsub: function(event) {
		if (window.event && window.event.keyCode == 13) {
	    	return false;
		} else if (event && event.which == 13) {
	    	return false;
		} else	{
    		return true;
    	}
    },
    //TESTING==================================================================================
	/**
	 * Splits the queryString. Each parameter is displayed on a seperate line. Only for testing.
	 * @param queryS The querystring
	 * @returns {String} the splitted string
	 */
	showQueryString: function(queryS) {
		return queryS.unescapeHTML().replace(/&/g, "<br />");
	}
};
