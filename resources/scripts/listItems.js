	function doSubmit(actie, sortKey, serviceID) {
		document.forms[1].actie.value = actie;
		var newSort = false;
		var sortDirection;
		var searchTerm;
		var savedSearchTerm;
		if (sortKey.length > 0) {
			/**
			 * Controleer of we op een nieuw element gaan sorteren 
			 */
			if (sortKey.toLowerCase() != document.forms[1].sortKey.value.toLowerCase()) {
				newSort = true;
			}			
			document.forms[1].sortKey.value = sortKey;
		} else {
			sortKey = document.forms[1].sortKey.value;
		}

		if (sortKey.length > 0 && actie.toLowerCase() == 'sort') {
			if (newSort) {
				if (sortKey.toLowerCase() == 'itemnumber' || sortKey.toLowerCase() =='datum') {
					sortDirection = 'desc';
				} else {
					sortDirection = 'asc';
				}
			}
			else {
				sortDirection = document.forms[1].sortDirection.value;
				if (sortDirection.toLowerCase() == 'asc') {
					sortDirection = 'desc';
				} else if (sortDirection.toLowerCase() == 'desc') {
					sortDirection = 'asc';
				} else {
					sortDirection = 'desc';
				}
			}
			document.forms[1].sortDirection.value = sortDirection;
		}
		
		searchTerm = document.forms[0].searchTerm.value;
		if (searchTerm.length > 0) {
			if (searchTerm.toLowerCase() != 'type uw zoekargument') {
				document.forms[1].searchTerm.value = searchTerm;
				document.forms[1].searchCriterium.value = -10;
			} 
		}

		savedSearchTerm = document.forms[1].searchTerm.value;
		if (savedSearchTerm.length > 0) {
				var searchAction;
				if (serviceID == '200') {
					searchAction = 'searchItems.html';
				} else if (serviceID == '300') {
					searchAction = 'searchItems2.html';
				}
				document.forms[1].action="/yourrequest/" + searchAction + "&serviceID="+ serviceID;
		}
				 	
		document.forms[1].submit();
	}

    function entsub(event,ourform, serviceID) {
		if (window.event && window.event.keyCode == 13) {
	    	doSubmit('','', serviceID);
	    	return false;
		} else if (event && event.which == 13) {
	    	doSubmit('','', serviceID);
	    	return false;
		} else	{
    		return true;
    	}
    }