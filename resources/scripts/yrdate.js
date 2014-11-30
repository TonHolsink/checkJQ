/**
 * DHTML date validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/datevalidation.asp)
 */
// Declaring valid date character, minimum year and maximum year
var YRDATE = YRDATE ? YRDATE : {
	dtCh : "/",
	minYear : 1900,
	maxYear : 2100,

	isInteger: function(s) {
		var i;
		for (i = 0; i < s.length; i++){
			// Check that current character is number.
			var c = s.charAt(i);
			if (((c < "0") || (c > "9"))) return false;
		}
		// All characters are numbers.
		return true;
	},

	stripCharsInBag: function(s, bag){
		var i;
		var returnString = "";
		// Search through string's characters one by one.
		// If character is not in bag, append to returnString.
		for (i = 0; i < s.length; i++){
			var c = s.charAt(i);
			if (bag.indexOf(c) == -1) returnString += c;
		}
		return returnString;
	},

	daysInFebruary: function(year){
		// February has 29 days in any year evenly divisible by four,
		// EXCEPT for centurial years which are not also divisible by 400.
		return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
	},

	daysArray: function(n) {
		for (var i = 1; i <= n; i++) {
			this[i] = 31;
			if (i==4 || i==6 || i==9 || i==11) {this[i] = 30;}
			if (i==2) {this[i] = 29;}
		}
		return this;
	},

	/**
	 * PRIVATE FUNCTION NOT TO BE USED IN A SCRIPT
	 * Checks if a date is valid
	 * @param dtStr The date string
	 * @returns an empty string if valid, otherwise an errormessage
	 */
	_isDate: function(dtStr){
		var result = "";
		var daysInMonth = YRDATE.daysArray(12);
		dtStr = dtStr.strip().gsub(/\D/, YRDATE.dtCh);
		var pos1=dtStr.indexOf(YRDATE.dtCh);
		var pos2=dtStr.indexOf(YRDATE.dtCh,pos1+1);
		var strDay=dtStr.substring(0,pos1);
		var strMonth=dtStr.substring(pos1+1,pos2);
		var strYear=dtStr.substring(pos2+1);
		strYr=strYear;
		if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1);
		if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1);
		for (var i = 1; i <= 3; i++) {
			if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1);
		}
		month=parseInt(strMonth);
		day=parseInt(strDay);
		year=parseInt(strYr);
		if (pos1==-1 || pos2==-1){
			result = "Het datum formaat moet zijn: dd/mm/jjjj";
			return result;
		}
		if (strMonth.length<1 || month<1 || month>12){
			result = "De maand is niet geldig!";
			return result;
		}
		if (strDay.length<1 || day<1 || day>31 || (month==2 && day>YRDATE.daysInFebruary(year)) || day > daysInMonth[month]){
			result = "De dag is niet geldig!";
			return result;
		}
		if (strYear.length != 4 || year==0 || year<YRDATE.minYear || year>YRDATE.maxYear){
			result = "Voer een 4 cijferig jaar op tussen "+YRDATE.minYear+" en "+YRDATE.maxYear;
			return result;
		}
		if (dtStr.indexOf(YRDATE.dtCh,pos2+1)!=-1 || YRDATE.isInteger(YRDATE.stripCharsInBag(dtStr, YRDATE.dtCh))==false){
			result = "De datum is niet geldig!";
			return result;
		}
		return result;
	},

	/**
	 * This method is for backward compatibility
	 * Checks if a date is valid and shows an alert if not valid
	 * @param dtStr The date string
	 * @returns true if valid, otherwise false
	 */
	isDate: function(dtStr){
		var result = YRDATE._isDate(dtStr);
		if (result) alert(result);
		return result.length == 0;
	},

	/**
	 * Checks if a date is valid
	 * @param dtStr The date string
	 * @param withMsg Optional. If defined the function returns a result string. If not it returns true or false.
	 * @returns true / false or a result string
	 */
	isValidDate: function(dtStr, withMsg){
		var result = YRDATE._isDate(dtStr);
		return withMsg ? result : result.length == 0;
	},

	/**
	 * PRIVATE FUNCTION NOT TO BE USED IN A SCRIPT
	 * Formats a date according to a given format
	 * @param dateS The date string to be formatted
	 * @param formatS The format. This must contain dd, MM, yyyy
	 * @param yearCorrection Optional. If defined adds 200 to year if year < 100
	 * @returns The formatted date
	 */
	_fmtDate: function(dateS, format, yearCorrection) {
		format = format.gsub(/[^dMy]{1,}/, "/");
		var date = dateS.gsub(/\D{1,}/, "/");
		var result = dateS;

		var a = date.split("/");
		if (a.length < 3) return result;
		var match = /^(dd\/MM\/yyyy|MM\/dd\/yyyy)$/.test(format);
		if (match) {
			var dayFirst = /^dd\/MM\/yyyy$/.test(format);
			var day;
			var month;
			var year = parseInt(a[2]);
			if (dayFirst) {
				day = parseInt(a[0]);
				month = parseInt(a[1]);
			} else {
				month = parseInt(a[0]);
				day = parseInt(a[1]);
			}
			if (day < 10) day = "0" + day;
			if (month < 10) month = "0" + month;
			if ((yearCorrection) && (year < 100)) year += 2000;
			result = format.sub("dd", day).sub("MM", month).sub("yyyy", year);
		}
		return result;
	},
	/**
	 * Formats a date according to a given format, with year correction
	 * @param dateS The date string to be formatted
	 * @param formatS The format. This must contain dd, MM, yyyy
	 * @returns The formatted date
	 */
	formatDate: function(dateS, formatS) {
		if (!formatS) formatS="dd/MM/yyyy";
		return YRDATE._fmtDate(dateS, formatS, true);
	},

	/**
	 * Formats a date according to a given format, without year correction
	 * @param dateS The date string to be formatted
	 * @param formatS The format. This must contain dd, MM, yyyy
	 * @returns The formatted date
	 */
	formatBirthDate: function(dateS, formatS) {
		if (!formatS) formatS="dd/MM/yyyy";
		return YRDATE._fmtDate(dateS, formatS, false);
	}

};
