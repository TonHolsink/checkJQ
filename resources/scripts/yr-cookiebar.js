var Cookies = Class.create({
	initialize: function(path, domain) {
		this.path = path || '/';
		this.domain = domain || null;
	},
	// Sets a cookie
	set: function(key, value, days) {
		if (typeof key != 'string') {
			throw "Invalid key";
		}
		if (typeof value != 'string' && typeof value != 'number') {
			throw "Invalid value";
		}
		if (days && typeof days != 'number') {
			throw "Invalid expiration time";
		}
		var setValue = key+'='+escape(new String(value));
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var setExpiration = "; expires="+date.toGMTString();
		} else var setExpiration = "";
		var setPath = '; path='+escape(this.path);
		var setDomain = (this.domain) ? '; domain='+escape(this.domain) : '';
		var cookieString = setValue+setExpiration+setPath+setDomain;
		document.cookie = cookieString;
	},
	// Returns a cookie value or false
	get: function(key) {
		var keyEquals = key+"=";
		var value = false;
		document.cookie.split(';').invoke('strip').each(function(s){
			if (s.startsWith(keyEquals)) {
				value = unescape(s.substring(keyEquals.length, s.length));
				throw $break;
			}
		});
		return value;
	},
	// Clears a cookie
	clear: function(key) {
		this.set(key,'',-1);
	},
	// Clears all cookies
	clearAll: function() {
		document.cookie.split(';').collect(function(s){
			return s.split('=').first().strip();
		}).each(function(key){
			this.clear(key);
		}.bind(this));
	}
});

var _cookieOK = {accepted:false, declined:false};

(function() {
	var COOKIENAME = "_cookieOK_B";
	var biscuits = new Cookies();

	getCookie();

	function getCookie() {
		_cookieOK.accepted = true;
		_cookieOK.declined = false;

		var cookie = biscuits.get(COOKIENAME);

		if (cookie && cookie == "1"){
			_cookieOK.accepted = true;
			_cookieOK.declined = false;
		}

		if (cookie && cookie == "0"){
			_cookieOK.declined = true;
			_cookieOK.accepted = false;
		}
	}

	function removeCookieBar() {
		var bar = $("Cookies_question");
		if (bar) {
			bar.remove();
		}
		bar = $("Cookies_status");
		if (bar) {
			bar.remove();
		}
	}

	function showCookieBar() {
		//In case the cookie bar is not in the DOM exit
		if (!$("cookieStatus")) {
			return;
		}

		$(document.body).removeClassName("cookievraag");

		var answered = (_cookieOK.accepted || _cookieOK.declined);

		var barHTML = "<div id='Cookies_question' class='cookiebar cookies_question'>";

		var barLink = "<a href='/cookies.shtml'>Informatie over cookies</a>";
		//Test if user is logged in
		if ($(document.body).hasClassName("user_is_logged_in")) {
			barLink = "<a href='cookies.html?contact=true'>Informatie over cookies</a>";
		}

		var barText = "<div class='story'>Deze site gebruikt cookies.&nbsp;" + barLink + "</div>";
		var barInfo = "";

		if (answered){
			barHTML = "<div id='Cookies_status' class='cookiebar cookies_status'>";
			var cookieStatus = "geweigerd";
			if (_cookieOK.accepted) cookieStatus = "toegestaan";
			barText = "<div class='text'><span id='cookie_site_uses_cookies'>Deze site gebruikt cookies. </span>Cookies " + cookieStatus + ".&nbsp;<a id='cookies_status_change' href='javascript:;'>Voorkeur wijzigen</a></div>";
			barInfo = "&nbsp;" + barLink;
		}

		barHTML += barText;
		barHTML += "<div id='cookie_forms' class='cookie_forms'>";
		barHTML += barInfo;
		barHTML += "<div class='cookies_buttons'>";
		barHTML += "<span id='btn_allow_true' class='cookies_button btn_allow_true'>Cookies toestaan</span>";
		barHTML += "<span id='btn_allow_false' class='cookies_button btn_allow_false'>Cookies weigeren</span>";
		barHTML += "</div>";
		barHTML += "</div>";
		barHTML += "</div>";

		if (answered) {
			$("cookieStatus").insert({top: barHTML});
			$("cookie_forms").hide();

			$("cookies_status_change").observe("click", function(event) {
				this.hide();
				$("cookie_site_uses_cookies").hide();
				$("cookie_forms").show();
			});

		} else {
			$("PageContent").insert({top: barHTML});
			$(document.body).addClassName("cookievraag");
		}

		$("btn_allow_true").observe("click", function(event) {
			biscuits.set(COOKIENAME, "1", 1*365);
			removeCookieBar();
			getCookie();
			showCookieBar();
		});

		$("btn_allow_false").observe("click", function(event) {
			biscuits.set(COOKIENAME, "0", 1*365);
			removeCookieBar();
			getCookie();
			showCookieBar();
		});

	}

	document.observe("dom:loaded", function() {
		showCookieBar();
	});

})();
