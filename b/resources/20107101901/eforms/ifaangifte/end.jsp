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
	};
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
	};

	var DIALOG_ENDED = true;  //Voorkomt melding dat je je gegevens kwijtraakt bij inloggen. Terwijl je klaar bent. Zie bpi_login_dialog.jsp
// ]]></script>
</c:if>

<div id="eformsContent" class="eformsContent">
	<form action="eforms.html" method="post" enctype="multipart/form-data" name="eform" id="eform">
		<input type="hidden" name="supplier" value="20107101901"/>
		<div class="eformsHeader">
			<h1 class="title">Afronden</h1>
		</div>
			<input type="hidden" name="formDefinitionCode" value="<c:out value="${requestScope['formDefinitionCode']}"/>"/>
			<input type="hidden" name="pageNumber" value="4"/>
			<input type="hidden" name="formCode" value="<c:out value="${requestScope['formCode']}"/>"/>
			<div class="formrow" id="row_">
				<span id="block_" class="infotext">
				Hartelijk dank voor uw aangifte.
				<p>
				De politie zal uw aangifte beoordelen en gebruiken in een eventueel strafrechtelijk onderzoek.
				Ook kan uw aangifte aanleiding zijn tot blokkade van de bankrekening, het IP-adres en/of het account van de adverteerder op de handelssite.
				</p>
				</span>
			</div>
			<div class="formrow" id="row_">
				<span id="block_" class="infotext"><br/></span>
			</div>
		<div class="eformsHeader">
			<h1 class="title">Bericht en afhandeling</h1>
		</div>
			<div class="formrow">
				<span class="infotext">
				U ontvangt vandaag een bevestiging per e-mail. Indien nodig neemt de Politie naar aanleiding van uw aangifte contact met u op.<br/>
				Vooralsnog hoeft u geen nadere actie te ondernemen.
				<br/><br/>
				U kunt uw melding voor uw eigen archief afdrukken. Kies hiervoor onderstaande link.<br/><br/>
 				<a class="morelink" href='getPDF.html?formDefinitionCode=<c:out value="${requestScope['formName']}"/>&amp;formCode=<c:out value="${requestScope['formCode']}"/>
									&amp;supCode=<c:out value="${requestScope['supplier']}"/>'/><span class="raquo">&raquo;&nbsp;</span>PDF openen</a><br/>
 				<br/><br/>
			</span>
		</div>
	</form>
</div>
<!-- contentarea -->

</body>
</html>
