
// initial request to retrieve poll data when not logged in
function getPollAnom() {
	var url='/b/getPollData.html';
	new Ajax.Request
	(
		url,
		{
			method: 'get',
		 	onComplete: handleRenderPoll
		}
	);
}

//initial request to retrieve poll data when logged in
function getPoll() {
	var url='getPollData.html';
	new Ajax.Request
	(
		url,
		{
			method: 'get',
		 	onComplete: handleRenderPoll
		}
	);
}

//submits a poll answer when not logged in
function answerPollAnom() {
	var url='/b/processPollAnswer.html';
	var chosen = getCheckedValue($('pollForm').elements['answerCode']);
	url = url + '?answerCode=' + chosen;
	new Ajax.Request
	(
		url,
		{
			method: 'get',
		 	onComplete: handleRenderPoll
		}
	);
	
}

// submits a poll answer when logged in
function answerPoll() {
	var url='processPollAnswer.html';
	var chosen = getCheckedValue($('pollForm').elements['answerCode']);
	url = url + '?answerCode=' + chosen;
	new Ajax.Request
	(
		url,
		{
			method: 'get',
		 	onComplete: handleRenderPoll
		}
	);
	
}

// handles getting the poll data
function handleRenderPoll(request) {
	if (request.status == 200) {
		var div = $('pollDetails');
		div.update(request.responseText || "Geen respons! Status = " + request.status);
	}
}
