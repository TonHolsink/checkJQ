/**
 * Submits the postalcode to start a meldingform. Used on the homepage
 */
function gotoMelding(mode) {
	var postalCode = document.forms[0].postalcode.value;
	if (postalCode.length > 3) {
		document.forms['postalcodeform'].submit();
	} else {
		if (mode == 0) {
			location.href='/eforms.shtml';
		} else {
			location.href='/b/contact.html?contact=true';
		}
	}
}

/**
 * Returns the value of the selected radio button in the radio group, null if
 * none are selected, and false if the button group doesn't exist
 *
 * @param {radio Object} or {radio id} el
 * OR
 * @param {form Object} or {form id} el
 * @param {radio group name} radioGroup
 */
function $RF(el, radioGroup) {
	if($(el).type && $(el).type.toLowerCase() == 'radio') {
		var radioGroup = $(el).name;
		var el = $(el).form;
	} else if ($(el).tagName.toLowerCase() != 'form') {
		return false;
	}

	var checked = $(el).getInputs('radio', radioGroup).find(
			function(re) {return re.checked;}
	);
	return (checked) ? $F(checked) : null;
}

/**
 * Returns the position of element obj (REAL coordinates)
 * @param obj
 * @return
 */
function findPos(obj) {
	var curleft = curtop = 0;

	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return [curleft,curtop];
	}
}

/*
 * Allows only a numeric value. If a non-numeric value key is pressed, dismiss it.
 */
function AllowOnlyNumeric(evt) {
	var key;

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
}

/*
 * Allows only an alphanumeric value.
 * If a non-alphanumeric value key is pressed, dismiss it.
 */
function AllowAlphaNumeric(evt) {
	var key;

	// Get the ASCII value of the key that the user entered
	if (window.event) {
		key = window.event.keyCode;
	} else if (evt) {
		key = evt.which;
	}

	// Verify if the key entered was a :
	// - numeric character (0-9)
	// - or a space
	// - or a uppercase
	// - or a lowercase
	if ((key > 47 && key < 58) ||
			key <= 32 ||
			(key > 64 && key < 91) ||
			(key > 96 && key < 123))
		// If it was, then allow the entry to continue
		return;
	else
		// If it was not, then dispose the key and continue with entry
		return false;
}

/*
 * Retrieves a request parameter with the given name, if present, and
 * returns the parameter's value. If the parameter is not present,
 * an empty string is returned.
 */
function gup( name )
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}

/**
 * Highlights the current row upon hovering
 * @param el The current td
 */
function trMouseIn(el) {
	//Ivm ie6 moet ik van 'this' (zo komt el binnen) expliciet een prototype element maken.
	Element.addClassName(el.parentNode, "hiliteRow");
}

/**
 * Removes the highlight of the current row on mouse exit
 * @param el The current td
 */
function trMouseOut(el) {
	//Ivm ie6 moet ik van 'this' (zo komt el binnen) expliciet een prototype element maken.
	Element.removeClassName(el.parentNode, "hiliteRow");
}

/**
 * Stops an event from propagating
 * @param ev The event
 */
function stopPropagation(ev) {
	if (!ev) var ev = window.event;
	ev.cancelBubble = true;
	if (ev.stopPropagation) ev.stopPropagation();
}

/**
 * Highlights the current row upon hovering
 * @param el The current td
 * @param noPointer The entire row shows a pointer when omitted, else a default cursor
 */
function trHilightOn(el, noPointer) {
	if (noPointer)
		Element.addClassName(el, 'servicetablenolink');
	else
		Element.addClassName(el, 'hiliteRow');
}

/**
 * Removes the highlight of the current row on mouse exit
 * @param el The current td
 * @param noPointer The entire row shows a pointer when omitted, else a default cursor
 */
function trHilightOff(el, noPointer) {
	if (noPointer)
		Element.removeClassName(el, 'servicetablenolink');
	else
		Element.removeClassName(el, 'hiliteRow');
}

//Returns the value of the radio button array supplied
function getCheckedValue(radioObj) {
	if(!radioObj)
		return "";

	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}

	return "";
}

/******************************************************************************************
* BUTTONS
******************************************************************************************/
/*
 * Activates a button
 * @param buttonid The id of the button
 */
function activateBtn(buttonid) {
	var el = $(buttonid);
	if (el) {
		el.removeClassName("inactive");
	}
}

/*
 * Deactivates a button
 * @param buttonid The id of the button
 */
function deactivateBtn(buttonid) {
	var el = $(buttonid);
	if (el) {
		el.addClassName("inactive");

	}
}

/*
 * Executes a function only when the button is active (not inactive)
 * @param func The function to be executed when the button is active
 * @param el The button ('this')
 */
function execIfActive(func, el) {
	if (el.hasClassName("inactive") == false) {
		func();
	}
}

var YRTOOLS = YRTOOLS ? YRTOOLS : {
	/**
	 * Shows a message in the messageBlock
	 * @param msg The message
	 * @param type The type (MSG or ERROR)
	 */
	showMessage: function(msg, type) {
		if (type == "ERROR" || type == "MSG") {
			var mb = $("messageBlock");
			type == "MSG" ? s = "<div class='message' id='successMessages'>": s = "<div class='error' id='errorMessages'>";
			s += msg;
			s += "</div>";
			mb.update(s);
		}
	},
	/**
	 * Shows a message in the messageBlock
	 * @param msg The message
	 */
	showMsg: function(msg) {
		YRTOOLS.showMessage(msg, "MSG");
	},
	/**
	 * Shows an error message in the messageBlock
	 * @param msg The message
	 */
	showErr: function(msg) {
		YRTOOLS.showMessage(msg, "ERROR");
	},

	__elHilight: function(parent, childSelector, noPointer, elName) {
		elName = elName ? elName : 'tr';
		childSelector = childSelector ? childSelector : "tr";
		if (parent) {
			parent.observe("mouseover", function(ev) {
				var target = ev.element().up(elName);
				if (target && target.match(childSelector)) {
					trHilightOn(target, noPointer);
				}
			});
			parent.observe("mouseout", function(ev) {
				var target = ev.element().up(elName);
				if (target && target.match(childSelector)) {
					trHilightOff(target, noPointer);
				}
			});
		}
	},

	/**
	 * Highlights a row in a table
	 * @param parent The parent container (table, tbody)
	 * @param childSelector ("tr" or "tr.someClass")
	 * @param noPointer The entire row shows a pointer when false, else a default cursor
	 */
	trHilight: function(parent, childSelector, noPointer) {
		YRTOOLS.__elHilight(parent, childSelector, noPointer, 'tr');
	},

	/**
	 * Highlights an element in a container
	 * @param parent The parent container
	 * @param childSelector ("div" or "div.someClass")
	 * @param noPointer The entire row shows a pointer when false, else a default cursor
	 * @param elName The target element
	 */
	elHilight: function(parent, childSelector, noPointer, elName) {
		YRTOOLS.__elHilight(parent, childSelector, noPointer, elName);
	}
}