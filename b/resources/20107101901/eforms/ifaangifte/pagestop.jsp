<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Aangifte Internetoplichting aan de politie</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
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
<div id="eformsContent" class="eformsContent"> 
    <form action="eforms.html" method="post" enctype="multipart/form-data" name="eform" id="eform">
	  <input type="hidden" name="supplier" value="20107101901"/>
		<div class="eformsHeader"> 
  			<h1 class="title">Aangifte Internetoplichting aan de politie </h1>
		</div>
      <input type="hidden" name="formDefinitionCode" value="<c:out value="${requestScope['formDefinitionCode']}"/>"/>
      <input type="hidden" name="pageNumber" value="<c:out value="${requestScope['submitPageNumber']}"/>"/>
      <input type="hidden" name="formCode" value="<c:out value="${requestScope['formCode']}"/>"/>
      <h2 class="questiontitle">Stoppen </h2>
      <div class="formrow" id="desc"> 
			<span id="block_info1" class="infotext">
				Weet u zeker dat u wilt stoppen en het venster wilt sluiten?<br>
				Vul dan de onderstaande vraag in en kies 'Ja ik stop'. 
				Uw formulier wordt dan niet verzonden.
			</span>      
      </div>
      <br/>
	  <div class="formRow">	
			Waarom stopt u?<br/>
			<input type="radio" value="A" name="stop_question"/> Het invullen kost me te veel tijd<br/>
			<input type="radio" value="B" name="stop_question"/> Ik zie nu dat ik dit formulier niet moet gebruiken<br/>
			<input type="radio" value="C" name="stop_question"/> Ik was alleen maar nieuwsgierig<br/>
	  </div>
      <p></p>
      <div class="formrow"> <span class="formbuttons"> 
        <input class="button" name="submit_action" value="Nee, ga terug" type="submit">
        <input class="button" name="submit_action" value="Ja, ik stop" type="submit">
        </span> </div>
    </form>
  </div>
  <!-- contentarea -->
</body>
</html>
