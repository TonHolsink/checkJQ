/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function(){};

	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
					return function() {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();

/***********************************************************************************************
/***********************************************************************************************
/***********************************************************************************************
/**********************************************************************************************/

function all(coll, iterator, context) {
	var result = true;
	jQuery.each(coll, function(index, el) {
		// console.log(context, index, el, this);
		result = result && !!iterator.call(context, el, index, this);
		if (!result) return false;
	});
	return result;
};

function any(coll, iterator, context) {
	var result = false;
	jQuery.each(coll, function(index, el) {
		// console.log(context, index, el, this);
		if (result = !!iterator.call(context, el, index, this)) return false;
	});
	return result;
};

function collect(coll, iterator, context) {
	var results = [];
	jQuery.each(coll, function(index, el) {
		results.push(iterator.call(context, el, index, this));
	});
	return results;
};

function findAll(coll, iterator, context) {
	var results = [];
	jQuery.each(coll, function(index, el) {
		if (iterator.call(context, el, index, this))
			results.push(el);
	});
	return results;
};

function camelize(str) {
	return str.replace(/(?:^|\s)\w/g, function(match) {
		return match.toUpperCase();
	});
};

function classNames($el) {
	var result = $.trim($el.attr('class')).split(/\s+/);
	if (result[0].length == 0) {
		return [];
	}
	return result;
};





/***********************************************************************************************
/***********************************************************************************************
/***********************************************************************************************
/**********************************************************************************************/


/*
* Really easy field validation with Prototype
* http://tetlaw.id.au/view/javascript/really-easy-field-validation
* Andrew Tetlaw
* Version 1.5.4.1 (2007-01-05)
*
* Copyright (c) 2007 Andrew Tetlaw
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use, copy,
* modify, merge, publish, distribute, sublicense, and/or sell copies
* of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
* BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
* ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/
var Validator = Class.extend();

Validator.prototype = {
	initialize : function(className, error, test, options) {
		console.log('Validator.initialize');
		if(typeof test == 'function'){
			this.options = options;
			this._test = test;
		} else {
			this.options = test;
			this._test = function(){return true};
		}
		this.error = error || 'Validation failed.';
		this.className = className;
	},
	test : function(v, elm) {
		console.log('Validator.test');
		return (this._test(v,elm) && all(this.options, function(p){
			return Validator.methods[p.key] ? Validator.methods[p.key](v,elm,p.value) : true;
		}));
	}
}
Validator.methods = {
	pattern : function(v,elm,opt) {return Validation.getIt('IsEmpty').test(v) || opt.test(v)},
	minLength : function(v,elm,opt) {return v.length >= opt},
	maxLength : function(v,elm,opt) {return v.length <= opt},
	min : function(v,elm,opt) {return v >= parseFloat(opt)},
	max : function(v,elm,opt) {return v <= parseFloat(opt)},
	notOneOf : function(v,elm,opt) {return all(opt, function(value) {
		return v != value;
	})},
	oneOf : function(v,elm,opt) {return any(opt, function(value) {
		return v == value;
	})},
	is : function(v,elm,opt) {return v == opt},
	isNot : function(v,elm,opt) {return v != opt},
	equalToField : function(v,elm,opt) {return v == $(opt).val()},
	notEqualToField : function(v,elm,opt) {return v != $(opt).val()},
	include : function(v,elm,opt) {return all(opt, function(value) {
		return Validation.getIt(value).test(v,elm);
	})}
}

var Validation = Class.extend();

Validation.prototype = {
	initialize : function(form, options){
		console.log(form);
		console.log('Validation.initialize');
		this.options = jQuery.extend({
			onSubmit : true,
			stopOnFirst : false,
			immediate : false,
			focusOnError : true,
			useTitles : false,
			onFormValidate : function(result, form) {},
			onElementValidate : function(result, elm) {}
		}, options || {});
		// this.form = $(form);
		this.form = $('#' + form);
		// if(this.options.onSubmit) Event.observe(this.form,'submit',this.onSubmit.bind(this),false);
		if(this.options.onSubmit) (this.form).on('submit', $.proxy(this.onSubmit, this), false);
		if(this.options.immediate) {
			var useTitles = this.options.useTitles;
			var callback = this.options.onElementValidate;
			(this.form).find(':input').each(function(input) { // Thanks Mike!
				// $(input).on('blur', function(ev) { Validation.validate(ev.currentTarget, {useTitle : useTitles, onElementValidate : callback}); });
				$(input).on('blur', function(ev) { Validation.validate(ev.target, {useTitle : useTitles, onElementValidate : callback}); });
			});
		}
	},
	onSubmit :  function(ev){
		console.log('Validation.onSubmit');
		if(!this.validate()) ev.stopPropagation();
	},
	validate : function() {
		console.log('Validation.validate1');
		var result = false;
		var useTitles = this.options.useTitles;
		var callback = this.options.onElementValidate;
		if(this.options.stopOnFirst) {
			result = all((this.form).find(':input'), function(elm) { return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback}); });
		} else {
			result = all(collect((this.form).find(':input'), function(elm) { return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback}); }));
		}
		if(!result && this.options.focusOnError) {
			// findAll((this.form).find(':input'), function(elm){return $('#' + elm).hasClass('validation-failed')}).first().focus();
			// first() zou ook moeten werken ipv get(0)
			findAll((this.form).find(':input'), function(elm){return $('#' + elm).hasClass('validation-failed')}).get(0).focus();
		}
		this.options.onFormValidate(result, this.form);
		return result;
	},
	reset : function() {
		console.log('Validation.reset');
		(this.form).find(':input').each(Validation.reset);
	},
	stop : function() {
		console.log('Validation.stop');
		// Event.stopObserving(this.form,'submit',this.onSubmit.bind(this),false);
		(this.form).off('submit', $.proxy(this.onSubmit, this), false);
		return true;
	}
}

jQuery.extend(Validation, {
	validate : function(elm, options){
		console.log('Validation.validate2');
		options = jQuery.extend({
			useTitle : false,
			onElementValidate : function(result, elm) {}
		}, options || {});
		elm = $('#' + elm);
		var cn = classNames(elm);
		return result = all(cn, function(value) {
			var test = Validation.test(value,elm,options.useTitle);
			options.onElementValidate(test, elm);
			return test;
		});
	},
	test : function(name, elm, useTitle) {
		console.log('Validation.test');
		var v = Validation.getIt(name);
		var prop = '__advice'+ camelize(name);
		try {
		if(Validation.isVisible(elm) && !v.test($(elm).val(), elm)) {
			if(!elm[prop]) {
				var advice = Validation.getAdvice(name, elm);
				if(advice == null) {
					//var errorMsg = useTitle ? ((elm && elm.title) ? elm.title : v.error) : v.error;
					var errorMsg = "Er zijn fouten op de pagina. Controleer a.u.b de rood omkaderde velden.";
					advice = '<div class="validation-advice" id="advice-' + name + '-' + Validation.getElmID(elm) +'" style="display:none">' + errorMsg + '</div>';
					var p = document.getElementById('errorhandle');
					switch (elm.type.toLowerCase()) {
						case 'checkbox':
						case 'radio':
//							var p = elm.parentNode;
							if(p) {
								p.innerHTML = advice;
								//new Insertion.Bottom(p, advice);
							} else {
								new Insertion.After(elm, advice);
							}
							break;
						default:
							p.innerHTML = advice;
							//new Insertion.After(p, advice); //p was elm
					}
					advice = Validation.getAdvice(name, elm);
				}
				if(typeof Effect == 'undefined') {
					advice.style.display = 'block';
				} else {
					new Effect.Appear(advice, {duration : 1 });
				}
			}
			elm[prop] = true;

			if ((elm.type.toLowerCase() == 'checkbox') || (elm.type.toLowerCase() == 'radio')) {
				var p = elm.parentNode;
				if (p) {
					p.removeClass('validation-passed');
					p.addClass('validation-failed');
				}
			}

			elm.removeClass('validation-passed');
			elm.addClass('validation-failed');
			return false;
		} else {
			var advice = Validation.getAdvice(name, elm);
			if(advice != null) advice.hide();
			elm[prop] = '';

			if ((elm.type.toLowerCase() == 'checkbox') || (elm.type.toLowerCase() == 'radio')) {
				var p = elm.parentNode;
				if (p) {
					p.removeClass('validation-failed');
					p.addClass('validation-passed');
				}
			}

			elm.removeClass('validation-failed');
			elm.addClass('validation-passed');
			return true;
		}
		} catch(e) {
			throw(e);
		}
	},
	isVisible : function(elm) {
		console.log('Validation.isVisible');
		while(elm.tagName != 'BODY') {
			if(!$(elm).visible()) return false;
			elm = elm.parentNode;
		}
		return true;
	},
	getAdvice : function(name, elm) {
		console.log('Validation.getAdvice');
		return $('#advice-' + name + '-' + Validation.getElmID(elm)) || $('#advice-' + Validation.getElmID(elm));
	},
	getElmID : function(elm) {
		console.log('Validation.getElmID');
		return elm.id ? elm.id : elm.name;
	},
	reset : function(elm) {
		console.log('Validation.reset');
		elm = $('#' + elm);
		var cn = classNames(elm);
		cn.each(function(value) {
			var prop = '__advice'+camelize(value);
			if(elm[prop]) {
				var advice = Validation.getAdvice(value, elm);
				advice.hide();
				elm[prop] = '';
			}
			elm.removeClass('validation-failed');
			elm.removeClass('validation-passed');
		});
	},
	add : function(className, error, test, options) {
		console.log('Validation.add');
		var nv = {};
		nv[className] = new Validator(className, error, test, options);
		jQuery.extend(Validation.methods, nv);
	},
	addAllThese : function(validators) {
		console.log('Validation.addAllThese');
		console.log('validators:');
		console.log(validators);
		var nv = {};
		jQuery.each(validators, function(value) {
				nv[value[0]] = new Validator(value[0], value[1], value[2], (value.length > 3 ? value[3] : {}));
			});
		jQuery.extend(Validation.methods, nv);
	},
	getIt : function(name) {
		console.log('Validation.getIt');
		return  Validation.methods[name] ? Validation.methods[name] : Validation.methods['_LikeNoIDIEverSaw_'];
	},
	methods : {
		'_LikeNoIDIEverSaw_' : new Validator('_LikeNoIDIEverSaw_','',{})
	}
});

Validation.add('IsEmpty', '', function(v) {
				return  ((v == null) || (v.length == 0)); // || /^\s+$/.test(v));
			});

Validation.addAllThese([
	['required', 'Dit is een verplicht veld.', function(v) {
				return !Validation.getIt('IsEmpty').test(v);
			}],
	['jpg', 'Aleen .jpg bestanden toegestaan.', function(v) {
				var lastPoint = v.lastIndexOf(".");
				var ext = v.substring(lastPoint+1);
				return (ext == "jpg");
			}],
	['validate-number', 'Voer een geldig nummer in.', function(v) {
				return Validation.getIt('IsEmpty').test(v) || (!isNaN(v) && !/^\s+$/.test(v));
			}],
	['validate-postal', 'Deze postcode is niet goed. Gebruik geen spatie. Bijvoorbeeld 1234AB', function(v) {
				return Validation.getIt('IsEmpty').test(v) || /^\d{4}[a-zA-Z]{2}$/.test(v);
			}],
	['validate-digits', 'Gebruik alleen cijfers. Punten, komma\'s en streepjes zijn niet toegestaan.', function(v) {
				return Validation.getIt('IsEmpty').test(v) ||  !/[^\d]/.test(v);
			}],
	['validate-alpha', 'Please use letters only (a-z) in this field.', function (v) {
				return Validation.getIt('IsEmpty').test(v) ||  /^[a-zA-Z]+$/.test(v)
			}],
	['validate-alphanum', 'Please use only letters (a-z) or numbers (0-9) only in this field. No spaces or other characters are allowed.', function(v) {
				return Validation.getIt('IsEmpty').test(v) ||  !/\W/.test(v)
			}],
	['validate-date', 'Geef een geldige datum op (dd/mm/yyyy).', function(v) {
				var pcFormat = /^(0[1-9]|[12][0-9]|3[01])([-])(0[1-9]|1[012])\2(19|20)\d\d$/;
				if (!pcFormat.test(v)) {
					return false;
				} else {
					var day = v.substr(0,2);
					var month = v.substr(3,2);
					var year = v.substr(6,4);
					if (day > 31 || month > 12) {
						return false;
					}
					return true;
				}
		}],
	['validate-email', 'Geef een geldig e-mail adres. Bijvoorbeeld fred@domain.com .', function (v) {
				return Validation.getIt('IsEmpty').test(v) || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v)
			}],
	['validate-phone', 'Geef een geldig telefoonnummer. Gebruik alleen cijfers, bijvoorbeeld 0101245678.', function (v) {
				return Validation.getIt('IsEmpty').test(v) || /^(0\d{9})$/.test(v)
			}],
	['validate-url', 'Geef een geldige URL.', function (v) {
				return Validation.getIt('IsEmpty').test(v) || /^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v)
			}],
	['validate-date-au', 'Voer een datum als volgt in: dd/mm/yyyy.', function(v) {
				if(Validation.getIt('IsEmpty').test(v)) return true;
				var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
				if(!regex.test(v)) return false;
				var d = new Date(v.replace(regex, '$2/$1/$3'));
				return ( parseInt(RegExp.$2, 10) == (1+d.getMonth()) ) &&
							(parseInt(RegExp.$1, 10) == d.getDate()) &&
							(parseInt(RegExp.$3, 10) == d.getFullYear() );
			}],
	['validate-currency-dollar', 'Please enter a valid $ amount. For example $100.00 .', function(v) {
				// [$]1[##][,###]+[.##]
				// [$]1###+[.##]
				// [$]0.##
				// [$].##
				return Validation.getIt('IsEmpty').test(v) ||  /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(v);
			}],
	['validate-selection', 'Maak een keuze', function(v,elm){
				return elm.options ? elm.selectedIndex > 0 : !Validation.getIt('IsEmpty').test(v);
			}],
	['validate-one-required', 'Kies een van bovenstaande opties.', function (v,elm) {
				var p = elm.parentNode;
				var options = p.getElementsByTagName('INPUT');
				return any(options, function(elm) {
					return $(elm).val();
				});
			}],
	['validate-bsn', 'Dit burgerservicenummer is niet goed.', function(v,elm){
				if(Validation.getIt('IsEmpty').test(v)) return true;
				var sum = 0;
				var i =0;
				for (i = 0; i < v.length; i++) {
					if (i == (v.length - 1)) {
						sum = sum - 1 * v.charAt(i);
					} else {
						sum = sum + (9 - i) * v.charAt(i);
					}
				}
				if ((sum % 11) != 0 ) {
					return false;
				}
				return true;
			}],
	['validate-ip', 'Dit ip-adres is niet goed.', function(v,elm){
				var pcFormat = /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/;
				if (Validation.getIt('IsEmpty').test(v)) {
					return true;
				} else if (!pcFormat.test(v)) {
					return false;
				}
				return true;
			}],
	['validate-amount', 'Bedrag', function(v,elm){
				var amountFormat = /^([0-9])+([,][0-9]{2})?$/;
				if (!amountFormat.test(v)) {
					return false;
				}
				return true;
			}],
	['validate-domesticaccountnr', 'Bankrekeningnummer', function(v,elm){
				var domAccountFormat = /^([1-9][0-9]{1,9})?$/;
				v = v.replace(/\./g, "");
				if (!domAccountFormat.test(v) || v.length > 10) {
					return false;
				}
				return true;
			}],
	['validate-iban', 'Bankrekeningnummer', function(v,elm){
		var payMethod = document.getElementById('payMethod').value;
		if (payMethod == 'IDEAL' || payMethod == 'overschrijving'){
			var newIban = v.toUpperCase(),
				modulo = function (divident, divisor) {
					var m = 0;
					for (var i = 0; i < divident.length; ++i)
					m = (m * 10 + parseInt(divident.charAt(i))) % divisor;
					return m;
				};

			if (newIban.search(/^[A-Z]{2}/gi) < 0) {
				return false;
			}

			newIban = newIban.substring(4) + newIban.substring(0, 4);

			newIban = newIban.replace(/[A-Z]/g, function (match) {
				return match.charCodeAt(0) - 55;
			});

			return parseInt(modulo(newIban, 97), 10) === 1;

		} else {
			var domAccountFormat = /^([1-9][0-9]{1,9})?$/;
			v = v.replace(/\./g, "");
			if (!domAccountFormat.test(v) || v.length > 10) {
				return false;
			}
			return true;
		}
			}]
]);
