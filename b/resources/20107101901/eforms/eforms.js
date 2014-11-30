var v_count = 0;
var submitcount = 0;
var dynamicFields = null;

/**
 * Call the backend to retrieve a street/place combi. 
 */
function getAddress() {
	//UITGEZET
	return;
	var postalCode = this.document.eform.postal.value;
	var houseNumber = this.document.eform.housenumber.value;
	if (postalCode != '' && houseNumber != '') {
		if (postalCode.length == 6) {
			var url='retrieveAddress.html';
			new Ajax.Request
			(
				url,
				{
					method: 'get',
					parameters: 'supplierid=20107101901&postal=' + postalCode + "|" + houseNumber,
				 	onComplete: setAddress
				}
			);
		}	
	}
}

/**
 * Process the result of the call to the address retrieval. 
 */
function setAddress(request) {
  	var pcData = request.responseText;
  	var jsonData = JSON.parse(pcData);
//    var jsonData = eval('(' + pcData + ')');
	var error = jsonData.error;
	if (error == '') {
		var street = jsonData.street;
		var place = jsonData.place;
		this.document.eform.street.value = street;
		this.document.eform.place.value = place;
	}		
}

function checkSubmitCount()
{
	submitcount++;
	
	if (submitcount == 1){
		return true;
	}
	return false;
}

function checkSubmitCount(pagenumber)
{
	submitcount++;
	
	if (submitcount == 1){
		var params = $('eform').serialize();
		var url='/b/eforms.html?submit_action=jump&jumpNumber=' + pagenumber + '&' + params;
		window.location = url;	
		return true;
	}
	return false;
}

function checkDialogSubmitCount(pagenumber)
{
	submitcount++;
	
	if (submitcount == 1){
		var params = $('dialog').serialize();
		var url='/b/formPage.html?submit_action=jump&jumpNumber=' + pagenumber + '&' + params;
		window.location = url;	
		return true;
	}
	return false;
}

function checkSecSubmitCount(pagenumber)
{
	submitcount++;
	
	if (submitcount == 1){
		var params = $('eform').serialize();
		var url='/b/seforms.html?submit_action=jump&jumpNumber=' + pagenumber + '&' + params;
		window.location = url;	
		return true;
	}
	return false;
}

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

function v_req(element) {
	fillMsg("", element);
	var formField = this.document.eform[element];
	if (formField.type == "text" || formField.type== "textarea" || formField.type=="select-one") {
		if (formField.value == "") {
			v_count++;
			fillMsg("! U heeft niets ingevuld. Geef antwoord op de vraag.<br/>", element);			
		}
	} else {
		var cbResult = getCheckedValue(formField);
		if (cbResult == "") {
			v_count++;
			fillMsg("! U heeft niets ingevuld. Geef antwoord op de vraag.<br/>", element);			
		}
	}
}

function v_ipaddress(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		var pcFormat = /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/;
		if (!pcFormat.test(formField.value)) {
			v_count++;
			fillMsg("! Dit ipadres is niet goed. Gebruik alleen cijfers en punten, bijvoorbeeld 123.123.123.123<br/>", element);			
		}
	}
}

function v_time(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		var pcFormat = /^\d{1,2}[:]\d{2}$/;
		if (!pcFormat.test(formField.value)) {
			v_count++;
			fillMsg("! Deze tijd is niet goed. Vul de tijd in volgens het formaat uu:mm.<br/>", element);			
		} else {
			var hours = formField.value.substr(0,2);
			var minutes = formField.value.substr(3,2);
			if (hours > 23 || minutes > 59) {
				v_count++;
				fillMsg("! Deze tijd is niet goed. Vul de tijd in volgens het formaat uu:mm.<br/>", element);			
			}
		}
	}
}

function v_date(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		var pcFormat = /^(0[1-9]|[12][0-9]|3[01])([-])(0[1-9]|1[012])\2(19|20)\d\d$/;
		if (!pcFormat.test(formField.value)) {
			v_count++;
			fillMsg("! Vul eerst de dag in, dan de maand en dan het jaar. Bijvoorbeeld 30-12-2005.<br/>", element);			
		} else {
			var day = formField.value.substr(0,2);
			var month = formField.value.substr(3,2);
			var year = formField.value.substr(6,4);
			if (day > 31 || month > 12 || year < 2009) {
				v_count++;
				fillMsg("! Vul eerst de dag in, dan de maand en dan het jaar. Bijvoorbeeld 30-12-2005.<br/>", element);			
			} else {
				var thedate = new Date(year, (month-1), day);
				if (thedate > new Date()) {
					v_count++;
					fillMsg("! Vul eerst de dag in, dan de maand en dan het jaar. Bijvoorbeeld 30-12-2005.<br/>", element);			
				}
			}
		}
	}
}

function v_date_past_allowed(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		var pcFormat = /^(0[1-9]|[12][0-9]|3[01])([-])(0[1-9]|1[012])\2(19|20)\d\d$/;
		if (!pcFormat.test(formField.value)) {
			v_count++;
			fillMsg("! Vul eerst de dag in, dan de maand en dan het jaar. Bijvoorbeeld 30-12-2005.<br/>", element);			
		} else {
			var day = formField.value.substr(0,2);
			var month = formField.value.substr(3,2);
			var year = formField.value.substr(6,4);
			if (day > 31 || month > 12 || year < 1900) {
				v_count++;
				fillMsg("! Vul eerst de dag in, dan de maand en dan het jaar. Bijvoorbeeld 30-12-2005.<br/>", element);			
			} else {
				var thedate = new Date(year, (month-1), day);
				if (thedate > new Date()) {
					v_count++;
					fillMsg("! Vul eerst de dag in, dan de maand en dan het jaar. Bijvoorbeeld 30-12-2005.<br/>", element);			
				}
			}
		}
	}
}

function v_postal(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		var pcFormat = /^\d{4}[a-zA-Z]{2}$/;
		if (!pcFormat.test(formField.value)) {
			v_count++;
			fillMsg("! Deze postcode is niet goed. Gebruik geen spatie. Bijvoorbeeld '1234AB'.<br/>", element);			
		}
	}
}

function v_email(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		var filter=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!filter.test(formField.value)) {
			v_count++;
			fillMsg("! Dit e-mailadres is niet goed. Een e-mailadres is bijvoorbeeld  " + 
					"'naam@voorbeeld.nl'. <br/>", element);
		}
	}
}

function v_phone(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		//check length
		if (formField.value.length != 10) {
			v_count++;
			fillMsg("! Dit telefoonnummer is niet goed. Vul tien cijfers in. Gebruik geen haakje of streepje. " + 
					"Bijvoorbeeld '0123456789'.<br/>", element);
		}
	}
	
}

function v_bsn(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		//check length
		if (formField.value.length != 9) {
			v_count++;
			fillMsg("! Dit burgerservicenummer is niet goed.<br/>", element);
		} else {
			var sum = 0;
			for (i = 0; i < formField.value.length; i++) {
				if (i == (formField.value.length - 1)) {
					sum = sum - 1 * formField.value.charAt(i);
				} else {
					sum = sum + (9 - i) * formField.value.charAt(i);
				}
			}
			if ((sum % 11) != 0 ) {
				v_count++;
				fillMsg("! Dit burgerservicenummer is niet goed.<br/>", element);
			}
		}
	} 
}

function checkMaxFieldLength(element, maxAllowed) {
	if (noenter()) {
		var contents = element.value;
		if (contents.length >= maxAllowed) {
			element.value = element.value.substring(0, maxAllowed);
			alert("! Deze tekst mag niet langer zijn dan " + maxAllowed + " karakters.");
		}
		return true;
	}
	return false;
}

function fillMsg(message, element) {
	var toFill = retrieveHandle("error_" + element);		
	if (typeof toFill != 'undefined') {
		toFill.innerHTML = message;
	}
}

function v_amount(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		var amountFormat = /^([0-9])+([,][0-9]{2})?$/;
		if (!amountFormat.test(formField.value)) {
			v_count++;
			fillMsg("! Dit bedrag is niet goed, geef een bedrag op (99 of 49,95)<br/>", element);			
		}
	}

}

function v_domesticaccountnr(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		fillMsg("", element);
		var domAccountFormat = /^([1-9][0-9]{1,9})?$/;
		if (!domAccountFormat.test(formField.value) || formField.value.length > 10) {
			v_count++;
			fillMsg("! Dit rekeningnummer is niet goed, het mag niet met een 0 of een spatie beginnen en moet uit maximaal 10 cijfers bestaan.<br/>", element);			
		}
	}
}

function v_url(element) {
	var formField = this.document.eform[element];
	if (formField.value != "") {
		var pcFormat = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;
		if (!pcFormat.test(formField.value)) {
			v_count++;
			fillMsg("! Dit webadres is niet goed. Vul een zo volledig mogelijk adres in, maar zonder een specifieke pagina op te geven. Dus bv. www.eenwinkel.nl of www.winkels.nl/mijnwinkel.<br/>", element);			
		}
	}
}

/*
 * Allows only a numeric value. If a non-numeric value key is pressed, dismiss it.
 */
function AllowOnlyNumeric(evt)
{
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
function AllowAlphaNumeric(evt)
{
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
 * Retrieves a handle to a document element.
 */
function retrieveHandle(id) {
		var x;
	
	if (document.getElementById) { 
	  x = document.getElementById(id); 
	} else if (document.all) { 
	  x = document.all(id); 
	} else if (document.layers) { 
	  x = document.layers[id]; 
	} 
	return x;
}

	function xyz() {		
	    var id = 'eform';
    	var x;
		if (document.getElementById) { 
		  x = document.getElementById(id); 
		} else if (document.all) { 
		  x = document.all(id); 
		} else if (document.layers) { 
		  x = document.layers[id]; 
		} 

		var elements = x.elements;
		for(var i=0;i<elements.length;i++)
		{ 
	  		if (elements[i].id != null && elements[i].id != '') {
	  			var key = elements[i].name;
				if (key.substring(0,3) == "msg") {
					var value = (elements[i]).value;
					if (value == null) {
						continue;
					}

					var errorId = 'error_' + key.substring(4);
	
					if (document.getElementById(errorId) != null) {
						document.getElementById(errorId).innerHTML = value;
					}
				}
			}			
	  	}
 	}

	function reset_count() {
		v_count = 0;
	}

	function get_count() {
		return v_count;
	}
	
	function showHideInfotext(id) {
		if (document.getElementById(id).style.display == 'block') {
			document.getElementById(id).style.display = 'none';
		} else {
			document.getElementById(id).style.display = 'block';
		}
	}

	
	function CountWords (this_field, id, maxAllowed) {
		var fullStr = this_field.value + " ";
		var initial_whitespace_rExp = /^[^A-Za-z0-9]+/gi;
		var left_trimmedStr = fullStr.replace(initial_whitespace_rExp, "");
		var non_alphanumerics_rExp = rExp = /[^A-Za-z0-9]+/gi;
		var cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ");
		var splitString = cleanedStr.split(" ");
		var word_count = splitString.length -1;
		if (fullStr.length <2) {
			word_count = 0;
		}
		
		document.getElementById(id).innerHTML="Dit veld bevat " + word_count + " woorden.";
		
		if (word_count >= maxAllowed) {
			alert("! Deze tekst mag niet langer zijn dan " + maxAllowed + " woorden.");
		}
		
		return word_count;
	}
	
	
	function writeDate() {
		var time=new Date();
		var lmonth=time.getMonth() + 1;
		if (lmonth <  10) {
			lmonth = "0" + lmonth;
		}
		var date=time.getDate();
		var year=time.getYear();
		if (year < 2000)
		year = year + 1900;
		var theDate = date + "-" + lmonth + "-" + year;
		return theDate;
	}

	function writeTime() {
		var time=new Date();
		var hours=time.getHours();
		if (hours < 10) {
			hours = "0" + hours;
		}
		var minutes=time.getMinutes();
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		var seconds=time.getSeconds();
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		var theTime = hours + ":" + minutes + ":" + seconds;
		return theTime;
	}

	function showGeneralError() {
		document.getElementById("general_error").style.display = 'block';
	}
	
	function noenter() {
		return !(window.event && window.event.keyCode == 13); 
	}    
	