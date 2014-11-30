<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>Melding internetoplichting aan de politie</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
<%@ include file="/common/taglibs.jsp"%>
<c:if test="${pageContext.request.remoteUser != null}">
<script type="text/javascript">
// <![CDATA[
	setTimeout('showSessionAlert()',720000);
	function showSessionAlert()	{
		var now=new Date();
		var newdate=new Date();
		var newtimems=newdate.getTime()+(3*60*1000);
		newdate.setTime(newtimems);
		alert('U bent meer dan 12 minuten bezig met het invullen van dit scherm. Klik op een knop onderin het invulscherm. ' +
				'U heeft hiervoor nog 3 minuten (tot ' + newdate.formatDate("H:i") + '). Anders moet u alle gegevens opnieuw invullen.');
	}
// ]]></script>
</c:if>
<c:if test="${pageContext.request.remoteUser == null}">
<script type="text/javascript">
// <![CDATA[
	setTimeout('showSessionAlert()',3300000);
	function showSessionAlert()	{
		var now=new Date();
		var newdate=new Date();
		var newtimems=newdate.getTime()+(5*60*1000);
		newdate.setTime(newtimems);
		alert('U bent meer dan 55 minuten bezig met het invullen van dit scherm. Klik op een knop onderin het invulscherm. ' +
				'U heeft hiervoor nog 5 minuten (tot ' + newdate.formatDate("H:i") + '). Anders moet u alle gegevens opnieuw invullen.');
	}
// ]]></script>
</c:if>

</head>
<body>
<script type="text/javascript">
// <![CDATA[
	/**
	 * Call the backend to retrieve a street/place combi.
	 */
	function getAddress() {
		//UITGEZET
		return;
		var postalCode = this.document.eform.wp_postal.value;
		var houseNumber = this.document.eform.wp_housenumber.value;
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
		var jsonData = eval('(' + pcData + ')');
		var error = jsonData.error;
		if (error == '') {
			var street = jsonData.street;
			var place = jsonData.place;
			this.document.eform.wp_street.value = street;
			this.document.eform.wp_place.value = place;
		}
	}


// ]]></script>
<div id="eformsContent" class="eformsContent">
	<form action="formPage.html" method="post" enctype="multipart/form-data" name="eform" id="dialog">
		<input type="hidden" name="supplier" value="20107101901"/>
		<div class="eformsHeader">
			<h1 class="title">Aangifte Internetoplichting aan de politie </h1>
		</div>
		<p id="errorhandle"></p>
		<input type="hidden" name="dialogSessionId" value="<c:out value="${requestScope['dialogSessionId']}"/>"/>
		<input type="hidden" name="formName" value="<c:out value="${requestScope['formName']}"/>"/>
		<input type="hidden" name="pageNumber" value="2"/>
		<input type="hidden" name="formCode" value="<c:out value="${requestScope['formCode']}"/>"/>
		<h2 class="questiontitle">Gegevens wederpartij</h2>
		<div class="formrow">
			<span class="infotext">
				Met wederpartij wordt de tegenpartij bedoeld: de persoon die zijn of haar afspraken met u niet is nagekomen.<br/>
			</span>
		</div>
		<div class="formrow">
			<span class="infotext">
				Vul onderstaande velden zo volledig en accuraat als mogelijk in. Wij wijzen u erop dat de melding correct en naar waarheid dient te worden ingevuld.<br/><br/>
				Velden met een * zijn verplicht. Door met de muis op de <span class="helptext">i</span> te staan, krijgt u extra informatie die u kan helpen bij het invullen van het antwoord.
			</span>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_firstname"><yre:printError formName="dialogForm" fieldName="wp_firstname"/></span>
			<div class="dialogquestion">
				Voorna(a)m(en)
			</div>
			<div class="dialoganswer">
				<input name="wp_firstname" size="50" maxlength="100" value="<c:out value="${requestScope['wp_firstname']}"/>" title="" type="text"/>
			</div>
		</div>
		<div class="formrow">
			<div class="dialogquestion">
				Tussenvoegsel(s) <span title="Bijvoorbeeld de, van, van der of el." class="helptext">i</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_middlename" size="10" maxlength="10" value="<c:out value="${requestScope['wp_middlename']}"/>" title="Bijvoorbeeld de, van, van der of el." type="text"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_lastname"><yre:printError formName="dialogForm" fieldName="wp_lastname"/></span>
			<div class="dialogquestion">
				Achternaam
			</div>
			<div class="dialoganswer">
				<input name="wp_lastname" size="50" maxlength="100" value="<c:out value="${requestScope['wp_lastname']}"/>" title="" type="text"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_username"><yre:printError formName="dialogForm" fieldName="wp_username"/></span>
			<div class="dialogquestion">
				Gebruikersnaam handelssite
			</div>
			<div class="dialoganswer">
				<input name="wp_username" size="30" maxlength="30" value="<c:out value="${requestScope['wp_username']}"/>" title="" type="text"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_email"><yre:printError formName="dialogForm" fieldName="wp_email"/></span>
			<div class="dialogquestion">
				E-mailadres wederpartij <span title="Als u het e-mailadres niet meer weet kunt u hier 'onbekend@onbekend.nl' invullen." class="helptext">i</span> <span class="mandatory">*</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_email" size="50" maxlength="50" value="<c:out value="${requestScope['wp_email']}"/>" title="" type="text" class="required validate-email"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_postal"><yre:printError formName="dialogForm" fieldName="wp_postal"/></span>
			<div class="dialogquestion">
				Postcode <span title="Gebruik geen spatie. Bijvoorbeeld 1234AB." class="helptext">i</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_postal" size="6" maxlength="6" value="<c:out value="${requestScope['wp_postal']}"/>" title="Gebruik geen spatie. Bijvoorbeeld 1234AB." type="text" onChange="getAddress()" class="validate-postal"/>
				&nbsp;<span class="grayed">(1234AA)</span>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_housenumber"><yre:printError formName="dialogForm" fieldName="wp_housenumber"/></span>
			<div class="dialogquestion">
				Huisnummer<span title="Vul alleen cijfers in." class="helptext">i</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_housenumber" size="10" maxlength="5" value="<c:out value="${requestScope['wp_housenumber']}"/>" title="Vul alleen cijfers in." onkeypress="return AllowOnlyNumeric(event)" type="text" onBlur="getAddress()"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_housenumber_addon"><yre:printError formName="dialogForm" fieldName="wp_housenumber_addon"/></span>
			<div class="dialogquestion">
				Huisnummer toevoeging <span title="Bijvoorbeeld II of bis." class="helptext">i</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_housenumber_addon" size="5" maxlength="4" onkeypress="return AllowAlphaNumeric(event)" value="<c:out value="${requestScope['wp_housenumber_addon']}"/>" title="Bijvoorbeeld II of bis." type="text"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_street"><yre:printError formName="dialogForm" fieldName="wp_street"/></span>
			<div class="dialogquestion">
				Straat
			</div>
			<div class="dialoganswer">
				<input name="wp_street" size="30" maxlength="35" value="<c:out value="${requestScope['wp_street']}"/>" title="" type="text"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_place"><yre:printError formName="dialogForm" fieldName="wp_place"/></span>
			<div class="dialogquestion">
				Woonplaats
			</div>
			<div class="dialoganswer">
				<input name="wp_place" size="30" maxlength="24" value="<c:out value="${requestScope['wp_place']}"/>" title="" type="text"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_country"><yre:printError formName="dialogForm" fieldName="wp_country"/></span>
			<div class="dialogquestion">
				Land
			</div>
			<div class="dialoganswer">
				<input name="wp_country" size="10" maxlength="10" value="<c:out value="${requestScope['wp_country']}"/>" title="" type="text"/>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_phone"><yre:printError formName="dialogForm" fieldName="wp_phone"/></span>
			<div class="dialogquestion">
				Telefoonnummer <span title="Vul tien cijfers in. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789." class="helptext">i</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_phone" size="10" maxlength="10" value="<c:out value="${requestScope['wp_phone']}"/>" onkeypress="return AllowOnlyNumeric(event)" title="Vul tien cijfers in. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789." type="text" class="validate-phone"/>
				<span class="grayed">(0201234567)</span>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_mobile"><yre:printError formName="dialogForm" fieldName="wp_mobile"/></span>
			<div class="dialogquestion">
				Mobiele telefoonnummer <span title="Vul tien cijfers in. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789." class="helptext">i</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_mobile" size="10" maxlength="10" value="<c:out value="${requestScope['wp_mobile']}"/>" onkeypress="return AllowOnlyNumeric(event)" title="Vul tien cijfers in. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789." type="text" class="validate-phone"/>
				<span class="grayed">(0612345678)</span>
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_wp_ipaddress"><yre:printError formName="dialogForm" fieldName="wp_ipaddress"/></span>
			<div class="dialogquestion">
				IP adres <span title="Dit is een nummer waarmee elke computer die verbonden is met het internet, zichtbaar is voor alle andere computers die online zijn. Bijvoorbeeld: 145.119.165.102. De volgende adressen invullen heeft geen zin, omdat dit bekende mailservers zijn : 10.X.X.X, 65.54.X.X, 65.55.X.X, 195.78.85.X, 209.85.X.X, 212.54.42.X" class="helptext">i</span>
			</div>
			<div class="dialoganswer">
				<input name="wp_ipaddress" size="15" maxlength="15" value="<c:out value="${requestScope['wp_ipaddress']}"/>" title="Vul een up nummer in, bijvoorbeeld : 192.168.0.1. Gebruik alleen cijfers en punten. De volgende adressen invullen heeft geen zin, omdat dit bekende mailservers zijn : 10.X.X.X, 65.54.X.X, 65.55.X.X, 195.78.85.X, 209.85.X.X, 212.54.42.X " type="text" class="validate-ip"/>
			</div>
		</div>
		<div class="formrow" id="feedback_wederpartij">
			<span class="errortext" id="error_feedback_wederpartij"><yre:printError formName="dialogForm" fieldName="feedback_wederpartij"/></span>
			<div class="dialogquestion">
				Mogen wij uw e-mailadres verstrekken aan de wederpartij zodat zij het geschil met u op kunnen lossen? Als u "nee" kiest krijgt de wederpartij geen melding van de door u gedane aangifte. <span class="mandatory">*</span>
			</div>
			<div class="dialoganswer">
				<span class="optionSpan">
					<logic:equal name="feedback_wederpartij" value="Y">
						<input name="feedback_wederpartij" value="Y" type="radio" checked class="s20 validate-one-required">
					</logic:equal>
					<logic:notEqual name="feedback_wederpartij" value="Y">
						<input name="feedback_wederpartij" value="Y" type="radio" class="s20 validate-one-required">
					</logic:notEqual>
					<label class="optionhor">Ja</label>
					<logic:equal name="feedback_wederpartij" value="N">
						<input name="feedback_wederpartij" value="N" type="radio" checked class="s20">
					</logic:equal>
					<logic:notEqual name="feedback_wederpartij" value="N">
						<input name="feedback_wederpartij" value="N" type="radio" class="s20">
					</logic:notEqual>
					<label class="optionhor">Nee</label>
				</span>
			</div>
		</div>
		<p></p>
		<logic:notPresent name="errors">
			<div class="formrow" id="general_error" style="display:none;">
			<span class="errortext" id="error_street">
				! U heeft niet alle verplichte vragen beantwoord. Na het invullen van deze vragen kunt u naar de volgende pagina.
			</span>
		</div>
		</logic:notPresent>
		<logic:present name="errors">
			<div class="formrow" id="general_error" style="display:block;">
			<span class="errortext" id="error_street">
				! U heeft niet alle verplichte vragen beantwoord. Na het invullen van deze vragen kunt u naar de volgende pagina.
			</span>
		</div>
	 </logic:present>
		<div class="formrow">
			<label class="formlabel">&nbsp;</label>
			<div class="forminput">
				<span class="formbuttons">
					<input class="button" name="submit_action" value="Volgende" onclick="return validate();" type="submit"/>
					<input class="button" name="submit_action" value="Vorige" onclick="return validate();" type="submit"/>
				</span>
			</div>
		</div>
	</form>
</div> <!-- contentarea -->
<script type="text/javascript">
// <![CDATA[

	function validate() {
/*		reset_count();
		v_req("wp_email");
		v_postal("wp_postal");
		v_email("wp_email");
		v_phone("wp_phone");
		v_phone("wp_mobile");
		v_ipaddress("wp_ipaddress");

		if (get_count() > 0) {
			showGeneralError();
			return false;
		} else {
			return checkSubmitCount();
		}
*/
	}

	new Validation('dialog', {immediate : true, useTitles : true}); // OR new Validation(document.forms[0]);

// ]]></script>

</body>
</html>
