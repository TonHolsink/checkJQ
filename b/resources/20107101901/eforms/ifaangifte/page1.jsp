<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>Aangifte internetoplichting aan de politie</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
<%@ include file="/common/taglibs.jsp"%>

</head>
<body>
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

<script type="text/javascript">
// <![CDATA[
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
		var jsonData = eval('(' + pcData + ')');
		var error = jsonData.error;
		if (error == '') {
			var street = jsonData.street;
			var place = jsonData.place;
			if (street != undefined && place != undefined) {
				this.document.eform.street.value = street;
				this.document.eform.place.value = place;
				this.document.eform.country.value='NEDERLAND';
			}
		}
	}
// ]]></script>
<div id="eformsContent" class="eformsContent">
	<form action="formPage.html" method="post" enctype="multipart/form-data" name="eform" id="dialog">
		<input type="hidden" name="supplier" value="20107101901"/>
		<div class="eformsHeader">
		<h1 class="title">Aangifte Internetoplichting aan de politie </h1>
		</div>
		<p id="errorhandle">
		</p>
		<input type="hidden" name="dialogSessionId" value="<c:out value="${requestScope['dialogSessionId']}"/>"/>
		<input type="hidden" name="formName" value="<c:out value="${requestScope['formName']}"/>"/>
		<input type="hidden" name="pageNumber" value="1"/>
		<input type="hidden" name="formCode" value="<c:out value="${requestScope['formCode']}"/>"/>
		<h2 class="questiontitle">Uw gegevens</h2>
		<div class="formrow"> <span class="infotext">
		Vul onderstaande velden zo volledig en accuraat als mogelijk in. Wij
		wijzen u erop dat de melding correct en naar waarheid dient te worden
		ingevuld.
		<br/><br/>
		Velden met een * zijn verplicht.
		Door met de muis op de <span class="helptext">i</span> te staan, krijgt
		u extra informatie die u kan helpen bij het invullen van het antwoord.
		</span> </div>
		<div class="formrow">
			<span class="errortext" id="error_bsn"><yre:printError formName="dialogForm" fieldName="bsn"/></span>
		<div class="dialogquestion">
			Burgerservicenummer
			<span title="Iedere Nederlandse burgers heeft een burgerservicenummer (BSN). Dit bsn is een persoonsnummer. Uw BSN vindt u bijvoorbeeld op uw rijbewijs of verzekeringspas. Indien u geen BSN nummer heeft, kunt u aangifte doen bij uw lokale politiebureau" class="helptext">i</span>
			<span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="bsn" size="10" maxlength="9" value="<c:out value="${requestScope['bsn']}"/>"
					 onkeypress="return AllowOnlyNumeric(event)" title="" type="text" class="required validate-bsn">
		</div>
		</div>
		<div class="formrow">
		<span class="errortext" id="error_firstname"><yre:printError formName="dialogForm" fieldName="firstname"/></span>
		<div class="dialogquestion">
			Voorna(a)m(en) <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="firstname" size="50" maxlength="100" value="<c:out value="${requestScope['firstname']}"/>" title="" type="text" class="required">
		</div>
		</div>
		<div class="formrow">
		<div class="dialogquestion">
		Tussenvoegsel(s) <span title="Bijvoorbeeld de, van, van der of el." class="helptext">i</span>
		</div>
		<div class="dialoganswer">
			<input name="middlename" size="10" maxlength="10" value="<c:out value="${requestScope['middlename']}"/>" title="Bijvoorbeeld de, van, van der of el." type="text">
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_lastname"><yre:printError formName="dialogForm" fieldName="lastname"/></span>
		<div class="dialogquestion">
			Achternaam<span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="lastname" size="50" maxlength="100" value="<c:out value="${requestScope['lastname']}"/>" title="" type="text" class="required">
		</div>
		</div>
		<div class="formrow" id="gender">
			<span class="errortext" id="error_gender"><yre:printError formName="dialogForm" fieldName="gender"/></span>
			<div class="dialogquestion">
				Geslacht <span class="mandatory">*</span>
			</div>
			<div class="dialoganswer">
				<span class="optionSpan">
					<logic:equal name="gender" value="M">
						<input name="gender" value="M" type="radio" checked class="s20 validate-one-required">
					</logic:equal>
					<logic:notEqual name="gender" value="M">
						<input name="gender" value="M" type="radio" class="s20 validate-one-required">
					</logic:notEqual>
					<label class="optionhor">Man</label>
					<logic:equal name="gender" value="V">
						<input name="gender" value="V" type="radio" checked class="s20">
					</logic:equal>
					<logic:notEqual name="gender" value="V">
						<input name="gender" value="V" type="radio" class="s20">
					</logic:notEqual>
					<label class="optionhor">Vrouw</label>
				</span>
			</div>
		</div>
		<div class="formrow">
		<span class="errortext" id="error_b_country">
			<yre:printError formName="dialogForm" fieldName="b_country"/>
		</span>
		<div class="dialogquestion">
			Geboorteland  <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="b_country" size="50" maxlength="50"
					 value="<c:out value="${requestScope['b_country']}"/>"
					 title="" type="text" class="required">
		</div>
		</div>
		<div class="formrow">
		<span class="errortext" id="error_b_date">
			<yre:printError formName="dialogForm" fieldName="b_date"/>
		</span>
		<div class="dialogquestion">
			Geboortedatum  <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="b_date" size="10" maxlength="10"
					 value="<c:out value="${requestScope['b_date']}"/>"
					 title="" type="text" class="required validate-date">
					 &nbsp;<span class="grayed">(dd-mm-jjjj)</span>
		</div>
		</div>
		<div class="formrow">
		<span class="errortext" id="error_b_place">
			<yre:printError formName="dialogForm" fieldName="b_place"/>
		</span>
		<div class="dialogquestion">
			Geboorteplaats <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="b_place" size="50" maxlength="40"
					 value="<c:out value="${requestScope['b_place']}"/>"
					 title="" type="text" class="required">
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_username"><yre:printError formName="dialogForm" fieldName="username"/></span>
		<div class="dialogquestion">
			Gebruikersnaam handelssite <span title="gebruikersnaam die u hanteert op de handelssite" class="helptext">i</span>
		</div>
		<div class="dialoganswer">
			<input name="username" size="30" maxlength="30" value="<c:out value="${requestScope['username']}"/>"
					 title="" type="text">
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_email"><yre:printError formName="dialogForm" fieldName="email"/></span>
		<div class="dialogquestion">
			E-mailadres <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="email" size="50" maxlength="50" value="<c:out value="${requestScope['email']}"/>" title="" type="text" class="required validate-email">
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_postal"><yre:printError formName="dialogForm" fieldName="postal"/></span>
		<div class="dialogquestion">
			Postcode <span title="Gebruik geen spatie. Bijvoorbeeld 1234AB." class="helptext">i</span> <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="postal" size="6" maxlength="6" value="<c:out value="${requestScope['postal']}"/>" title="Gebruik geen spatie. Bijvoorbeeld 1234AB."
				type="text" onChange="getAddress()" class="required validate-postal">&nbsp;<span class="grayed">(1234AA)</span>
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_housenumber"><yre:printError formName="dialogForm" fieldName="housenumber"/></span>
		<div class="dialogquestion">
			Huisnummer<span title="Vul alleen cijfers in." class="helptext">i</span> <span class="mandatory">*</span>
		</div>
			<div class="dialoganswer">
				<input name="housenumber" size="10" maxlength="5" value="<c:out value="${requestScope['housenumber']}"/>" title="Vul alleen cijfers in."
					 onkeypress="return AllowOnlyNumeric(event)"  type="text" onBlur="getAddress()" class="required validate-digits">
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_housenumber_addon"><yre:printError formName="dialogForm" fieldName="housenumber_addon"/></span>
		<div class="dialogquestion">
			Huisnummer toevoeging <span title="Bijvoorbeeld II of bis." class="helptext">i</span>
		</div>
			<div class="dialoganswer">
				<input name="housenumber_addon" size="5" maxlength="4"
								onkeypress="return AllowAlphaNumeric(event)"
								value="<c:out value="${requestScope['housenumber_addon']}"/>"
							title="Bijvoorbeeld II of bis." type="text">
			</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_street"><yre:printError formName="dialogForm" fieldName="street"/></span>
		<div class="dialogquestion">
			Straat <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="street" size="30" maxlength="35" value="<c:out value="${requestScope['street']}"/>" title="" type="text" class="required">
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_place"><yre:printError formName="dialogForm" fieldName="place"/></span>
		<div class="dialogquestion">
			Woonplaats <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="place" size="30" maxlength="24" value="<c:out value="${requestScope['place']}"/>" title="" type="text" class="required">
		</div>
		</div>
		<div class="formrow">
		<span class="errortext" id="error_country"><yre:printError formName="dialogForm" fieldName="country"/></span>
		<div class="dialogquestion">
			Land <span class="mandatory">*</span>
		</div>
		<div class="dialoganswer">
			<input name="country" size="15" maxlength="20" value="<c:out value="${requestScope['country']}"/>" title="" type="text" class="required">
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_phone"><yre:printError formName="dialogForm" fieldName="phone"/></span>
		<div class="dialogquestion">
				Telefoonnummer <span title="Vul tien cijfers in, zonder landcode. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789."
							class="helptext">i</span>
		</div>
		<div class="dialoganswer">
			<input name="phone" size="10" maxlength="10" value="<c:out value="${requestScope['phone']}"/>"
					onkeypress="return AllowOnlyNumeric(event)"
					title="Vul tien cijfers in, zonder landcode. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789."
					type="text" class="validate-phone" />
					<span class="grayed">(0201234567)</span>
		</div>
		</div>
		<div class="formrow">
			<span class="errortext" id="error_mobile"><yre:printError formName="dialogForm" fieldName="mobile"/></span>
		<div class="dialogquestion">
			Mobiele telefoonnummer <span title="Vul tien cijfers in, zonder landcode. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789."
							class="helptext">i</span>
		</div>
		<div class="dialoganswer">
			<input name="mobile" size="10" maxlength="10" value="<c:out value="${requestScope['mobile']}"/>"
					onkeypress="return AllowOnlyNumeric(event)"
					title="Vul tien cijfers in, zonder landcode. Gebruik geen streepje, haakje of spatie. Bijvoorbeeld 0123456789."
					type="text" class="validate-phone"/>
					<span class="grayed">(0612345678)</span>
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

		<div class="formrow"> <span class="formbuttons">
		<button class="button" name="submit_action" value="Volgende" id="submit" type="submit">
			<yre:message key="form.next"/>
		</button>
		</span> </div>
	</form>
  </div>
  <!-- contentarea -->
<script type="text/javascript">
// <![CDATA[
	new Validation('dialog', {immediate : true, useTitles : true}); // OR new Validation(document.forms[0]);
// ]]></script>

</body>
</html>
