var YRTOOLSJQ = YRTOOLSJQ ? YRTOOLSJQ : {
	/**
	 * Highlights the current row upon hovering
	 * @param el The current td
	 * @param noPointer The entire row shows a pointer when omitted, else a default cursor
	 */
	trHilightOn: function(el, noPointer) {
		if (noPointer)
			el.addClass('servicetablenolink');
		else
			el.addClass('hiliteRow');
	},

	/**
	 * Removes the highlight of the current row on mouse exit
	 * @param el The current td
	 * @param noPointer The entire row shows a pointer when omitted, else a default cursor
	 */
	trHilightOff: function(el, noPointer) {
		if (noPointer)
			el.removeClass('servicetablenolink');
		else
			el.removeClass('hiliteRow');
	},

	__elHilight: function(parent, childSelector, noPointer, elName) {
		elName = elName ? elName : 'tr';
		childSelector = childSelector ? childSelector : "tr";
		if (parent.length) {
			parent.mouseover(function(ev) {
				var target = $(ev.target).closest(elName);
				if (target.length && target.is(childSelector)) {
					YRTOOLSJQ.trHilightOn(target, noPointer);
				}
			});
			parent.mouseout(function(ev) {
				var target = $(ev.target).closest(elName);
				if (target.length && target.is(childSelector)) {
					YRTOOLSJQ.trHilightOff(target, noPointer);
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
		YRTOOLSJQ.__elHilight(parent, childSelector, noPointer, 'tr');
	},

	/**
	 * Highlights an element in a container
	 * @param parent The parent container
	 * @param childSelector ("div" or "div.someClass")
	 * @param noPointer The entire row shows a pointer when false, else a default cursor
	 * @param elName The target element
	 */
	elHilight: function(parent, childSelector, noPointer, elName) {
		YRTOOLSJQ.__elHilight(parent, childSelector, noPointer, elName);
	}

};
