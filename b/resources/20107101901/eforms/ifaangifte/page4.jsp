<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title>Aangifte internetoplichting aan de politie</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
<%@ include file="/common/taglibs.jsp"%>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>

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
<div id="eformsContent" class="eformsContent">
	<form action="formPage.html" method="post" enctype="multipart/form-data" name="eform" id="dialog">
		<input type="hidden" name="supplier" value="20107101901"/>
		<div class="eformsHeader">
			<h1 class="title">Aangifte internetoplichting aan de politie</h1>
		</div>
		<input type="hidden" name="dialogSessionId" value="<c:out value="${requestScope['dialogSessionId']}"/>"/>
		<input type="hidden" name="formDefinitionCode" value="<c:out value="${requestScope['formDefinitionCode']}"/>"/>
		<input type="hidden" name="pageNumber" value="4"/>
		<input type="hidden" name="formCode" value="<c:out value="${requestScope['formCode']}"/>"/>
		<h2 class="questiontitle">Controleren en verzenden</h2>
		<p></p>
		<p>
			Hieronder ziet u uw aangifte zoals u deze heeft ingevuld. Wij verzoeken u deze gegevens te controleren.
			Als de aangifte correct is moet u dit onderaan het scherm bevestigen en op "verzenden" klikken.
		</p>
		<p>
			Uw aangifte wordt dan direct naar de politie gestuurd, en u ontvangt een ontvangstbevestiging op het e-mailadres dat u heeft ingevoerd.
		</p>
		<fieldset class="previewformfield">
			<h2 class="questiontitle">Uw ingevulde gegevens zijn: </h2>
			<div class="formrow">
				<div class="dialogquestion">Burgerservice nummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['bsn']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Voorna(a)am(en)</div>
				<div class="dialoganswer"><c:out value="${requestScope['firstname']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Tussenvoegsels</div>
				<div class="dialoganswer"><c:out value="${requestScope['middlename']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Achternaam</div>
				<div class="dialoganswer"><c:out value="${requestScope['lastname']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Geslacht</div>
				<div class="dialoganswer"><c:out value="${requestScope['gender']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Geboorteland</div>
				<div class="dialoganswer"><c:out value="${requestScope['b_country']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Geboortedatum</div>
				<div class="dialoganswer"><c:out value="${requestScope['b_date']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Geboorteplaats</div>
				<div class="dialoganswer"><c:out value="${requestScope['b_place']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Gebruikersnaam</div>
				<div class="dialoganswer"><c:out value="${requestScope['username']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">E-mailadres </div>
				<div class="dialoganswer"><c:out value="${requestScope['email']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Straatnaam</div>
				<div class="dialoganswer"><c:out value="${requestScope['street']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Huisnummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['housenumber']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Huisnummer toevoeging</div>
				<div class="dialoganswer"><c:out value="${requestScope['housenumber_addon']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Postcode</div>
				<div class="dialoganswer"><c:out value="${requestScope['postal']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Woonplaats</div>
				<div class="dialoganswer"><c:out value="${requestScope['place']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Land</div>
				<div class="dialoganswer"><c:out value="${requestScope['country']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Telefoonnummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['phone']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Mobiele telefoonnummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['mobile']}"/></div>
			</div>
		</fieldset>
		<br/>
		<fieldset class="previewformfield">
			<h2 class="questiontitle">Gegevens wederpartij</h2>
			<div class="formrow">
				<div class="dialogquestion">Voorna(a)m(en)</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_firstname']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Tussenvoegsels</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_middlename']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Achternaam</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_lastname']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Gebruikersnaam</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_username']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">E-mailadres </div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_email']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Straatnaam</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_street']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Huisnummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_housenumber']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Huisnummer toevoeging</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_housenumber_addon']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Postcode</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_postal']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Woonplaats</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_place']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Land</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_country']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Telefoonnummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_phone']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Mobiele telefoonnummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_mobile']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">IP adres</div>
				<div class="dialoganswer"><c:out value="${requestScope['wp_ipaddress']}"/></div>
			</div>
		</fieldset>
		<br/>
		<fieldset class="previewformfield">
			<h2 class="questiontitle">Transactiegegevens</h2>
			<div class="formrow">
				<div class="dialogquestion">URL website</div>
				<div class="dialoganswer"><c:out value="${requestScope['site_url']}"/></div>
			</div>
			<logic:equal name="site_url" value="Overige">
				<div class="formrow">
					<div class="dialogquestion">URL website (overig)</div>
					<div class="dialoganswer"><c:out value="${requestScope['site_url_other']}"/></div>
				</div>
				<div class="formrow">
					<div class="dialogquestion">Hier gekomen via</div>
					<div class="dialoganswer"><c:out value="${requestScope['referrer']}"/></div>
				</div>
			</logic:equal>

		<!-- d.d. 27-11-2013 Ton ************************************************************************ -->
		<!-- Niet deleten. Vragen of het telefoonnummer aan marktplaats ********************************* -->
		<!-- mag worden doorgegeven mogelijk later weer nodig. ****************************************** -->
		<!-- OOK GEDEELTE PAG 3 UITGEREMD ***************************************************************

			<logic:equal name="site_url" value="www.marktplaats.nl">
				<div class="formrow">
					<div class="dialogquestion">Telefoonnummer mag doorgegeven aan Marktplaats indien van toepassing</div>
					<div class="dialoganswer"><c:out value="${requestScope['phone_mp']}"/></div>
				</div>
			</logic:equal>
		************************************************************************************************* -->
		<!-- ******************************************************************************************** -->
		<!-- ******************************************************************************************** -->

			<div class="formrow">
				<div class="dialogquestion">Advertentietitel</div>
				<div class="dialoganswer"><c:out value="${requestScope['adverttitle']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Advertentienummer</div>
				<div class="dialoganswer"><c:out value="${requestScope['advertnumber']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Omschrijving</div>
				<div class="dialoganswer"><c:out value="${requestScope['description']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Aanvullende gegevens</div>
				<div class="dialoganswer"><c:out value="${requestScope['description_extra']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Datum betaling</div>
				<div class="dialoganswer"><c:out value="${requestScope['paymentdate']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Bedrag aankoop</div>
				<div class="dialoganswer"><c:out value="${requestScope['amount']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Betalingsmethode</div>
				<div class="dialoganswer"><c:out value="${requestScope['paymentmethod']}"/></div>
			</div>
			<logic:equal name="paymentmethod" value="anders">
				<div class="formrow">
					<div class="dialogquestion">Namelijk</div>
					<div class="dialoganswer"><c:out value="${requestScope['paymentmethod_other']}"/></div>
				</div>
			</logic:equal>
			<div class="formrow">
				<div class="dialogquestion">Bankrekeningnummer wederpartij</div>
				<div class="dialoganswer"><c:out value="${requestScope['accountnumber']}"/></div>
			</div>
			<div class="formrow">
				<div class="dialogquestion">Naam rekeninghouder wederpartij</div>
				<div class="dialoganswer"><c:out value="${requestScope['accountowner']}"/></div>
			</div>
			<logic:equal name="paymentmethod" value="paypal">
				<div class="formrow">
					<div class="dialogquestion">Paypal e-mailadres wederpartij</div>
					<div class="dialoganswer"><c:out value="${requestScope['paypalname']}"/></div>
				</div>
			</logic:equal>
			<div class="formrow">
				<div class="dialogquestion">Datum aangifte</div>
				<div class="dialoganswer"><c:out value="${requestScope['meldingdate']}"/></div>
			</div>
		</fieldset>
		<fieldset class="previewformfield">
			<div class="formrow" id="row_ep_formulier_accoord">
				<span class="errortext" id="error_form_ok"> </span>
				<div class="dialogquestion">
					Zijn de gegevens correct en naar waarheid ingevuld?<span class="mandatory">*</span>
				</div>
				<div id="radio_ep_formulier_accoord" class="dialoganswer">
					<span class="optionSpan">
						<input name="form_ok" value="J" onclick="checkForm_ok()" type="radio" class="s20">
						<label for="form_ok_t" class="optionhor">Ja</label>
						<input name="form_ok" value="N" onclick="checkForm_nok()" type="radio" class="s20">
						<label for="form_ok_f" class="optionhor">Nee</label>
					</span>
				</div>
			</div>
			<p></p>
			<logic:notPresent name="errors">
				<div class="formrow" id="general_error" style="display:none;">
					<span class="errortext" id="error_street">
						! Er zijn fouten op deze pagina geconstateerd. Los deze eerst op voordat u verder kunt gaan.
					</span>
				</div>
			</logic:notPresent>
			<logic:present name="errors">
				<div class="formrow" id="general_error" style="display:block;">
					<span class="errortext" id="error_street">
						! Er zijn fouten op deze pagina geconstateerd. Los deze eerst op voordat u verder kunt gaan.
					</span>
				</div>
			</logic:present>
			<div class="formrow">
					<span class="formbuttons" id="buttonBar">
						<input class="button" name="submit_action" value="Verzenden" onclick="return validate();" type="submit" id="buttonNext">
						<input class="button" name="submit_action" value="Vorige" onclick="return validate();" type="submit"/>
						<img src="/resources/images/spinner.gif" id="spinner" style="display: none;" />
					</span>
			</div>
		</fieldset>
	</form>
</div> <!-- contentarea -->
<script type="text/javascript">
// <![CDATA[
	//disable next button by default
	checkForm_nok_init();

	function validate() {
		reset_count();
		v_req("form_ok");

		if (get_count() > 0) {
			showGeneralError();
			return false;
		} else {
			showSpinner();
			return true;
		}
	}

	function showSpinner() {
		$$("#buttonBar .button").each(function(el) {
			el.setStyle({display: 'none'});
		});
		$('spinner').setStyle({display: 'block'});
	}

	function checkForm_ok() {
		document.getElementById('buttonNext').style.display='block';
	}

	function checkForm_nok() {
		document.getElementById('buttonNext').style.display='none';
	}

	function checkForm_nok_init() {
		document.getElementById('buttonNext').style.display='none';
	}

//	function doSubmitMail() {
//		if (validate()) {
//			document.forms[0].action="makeMail.html";
//			return true;
//		} else {
//			return false;
//		}
//	}

// ]]></script>
</body>
</html>
