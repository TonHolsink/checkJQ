/**
 * Session timeout script.
 * This script sets a timer with timerinterval = timeoutMillis + TIMEOUTOFFSET;
 * The timer checks if there is a new session (this means the session timed out)
 * The checking is done with an ajax call.
 * If the session is timed out, an alert box is displayed which informs the user.
 * If location (the optional redirection location) is defined the browser is redirected to for instance the login page
 * If the session is not timed out (for instance when another window is open) the procedure repeats itself. 
 */
var YRSESSION = YRSESSION ? YRSESSION :
{
	TIMEOUTOFFSET: 30 * 1000, //The timeout offset in ms. timerinterval = timeoutMillis + TIMEOUTOFFSET;
	CHECKSESSIONURL: "checkSession.html", //The url of the jsp that checks if the session has timed out.
	timeoutMillis: null, //timeout in ms. Set in jsp.
	timerID: null, //timer ID
	timerRunning: false, //Is the timer running
	startTime: null, //Start of the session
	location: null, //Redirection location after session timeout (if null, nothing happens). Set in jsp.
	
	/**
	 * Initializes the timeout checking, and defines an optional redirection location.
	 * @param location The redirection location.
	 * @param maxInactiveInterval The maximum time interval, in seconds, that the servlet container will keep this session open.
	 */
	initSessionTimeOutCheck: function (location, maxInactiveInterval) {
		if ((location) && (!location.blank()))
			YRSESSION.location = location;
		YRSESSION.timeoutMillis = maxInactiveInterval * 1000;
		YRSESSION.resetSessionTimeoutCheck();
	},
	/**
	 * Starts the timeout checking.
	 */
	startSessionTimeoutCheck: function () {
		YRSESSION.startTime = new Date(); //Start of the session
		YRSESSION.timerID = setTimeout("YRSESSION.checkSession()", YRSESSION.timeoutMillis + YRSESSION.TIMEOUTOFFSET);
		YRSESSION.timerRunning = true;
	},
	/**
	 * Stops the timeout checking.
	 */
	stopSessionTimeoutCheck: function () {
		if (YRSESSION.timerRunning)
			clearTimeout(YRSESSION.timerID);
		YRSESSION.timerRunning = false;
	},
	/**
	 * Resets the timeout checking.
	 */
	resetSessionTimeoutCheck: function () {
		YRSESSION.stopSessionTimeoutCheck();
		YRSESSION.startSessionTimeoutCheck();
	},
	/**
	 * The ajax call to the jsp which checks if the session has timed out.
	 * The jsp responds with a simple json string. 
	 */
	checkSession: function () {
		new Ajax.Request(YRSESSION.CHECKSESSIONURL, {
			method: 'get',
			onSuccess: function(transport) {
				var session = transport.responseText.evalJSON();
				if (session.sessionIsNew) {
					YRSESSION.alertTimeout();
				} else {
					YRSESSION.resetSessionTimeoutCheck();
				}
			}
		});			
	},
	/**
	 * Shows an alert box and optionally redirects the browser.
	 */
	alertTimeout: function () {
		var currentTime = new Date();
//		alert(YRSESSION.startTime + "\n" + currentTime + "\nUw sessie is afgelopen. Uw moet opnieuw inloggen!"); //Voor testen
		alert("Uw sessie is afgelopen. Uw moet opnieuw inloggen!");
		if (YRSESSION.location) window.location = YRSESSION.location; 
	}
};