//Validation unit
var YRVAL = YRVAL ? YRVAL : function() {

	// Check if string is an integer, with an optional +/- sign character.
	var isInteger_re = /^(\+|-)?\d+$/;
	isInteger = function(s) {
		return String(s).search (isInteger_re) != -1
	};

	// Check if string is a whole number(digits only, >=0).
	var isWhole_re = /^\d+$/;
	isWhole = function(s) {
		return String(s).search (isWhole_re) != -1
	};

	// Check if input is numeric (dutch locale)
	isNumber = function(n) {
		var RE = /^[-|+]{0,1}\d*\,{0,1}\d+$/;
		return (RE.test(n));
	};

	// Check if input is numeric (us locale)
	isNumberUS = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	// Check if string is blank (not assigned or only wite space)
	isBlank = function(s) {
		return (!s || s.trim().length == 0);
		// return !isNonBlank(s);
	};

	// Check if string is non-blank (assigned and not only whte space)
	isNonBlank = function(s) {
		return !isBlank(s);
	};

	isEmail = function(value) {
		if (value.blank() == false) {
			var filter=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if (!filter.test(value)) {
				return false;
			}
		}
		return true;
	};


	var oPublic =
	{
		isInteger: isInteger,
		isWhole: isWhole,
		isNumber: isNumber,
		isNumberUS: isNumberUS,
		isNonBlank: isNonBlank,
		isBlank: isBlank,
		isEmail: isEmail
	};

	return oPublic;
}();