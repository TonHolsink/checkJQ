<script type="text/javascript">
    function validateForm(form) {                                                               
        return true;
        //validateRequired(form); 
    } 
    
    function passwordHint() {
        if ($("j_username").value.length == 0) {
            alert("The <fmt:message key="label.username"/> field must be filled in to get a password hint sent to you.");
            $("j_username").focus();
        } else {
            location.href="<c:url value="/passwordHint.html"/>?username=" + $("j_username").value;     
        }
    }
    
    function required () { 
        this.aa = new Array("j_username", "<fmt:message key="errors.required"><fmt:param><fmt:message key="label.username"/></fmt:param></fmt:message>", new Function ("varName", " return this[varName];"));
        this.ab = new Array("j_password", "<fmt:message key="errors.required"><fmt:param><fmt:message key="label.username"/></fmt:param></fmt:message>", new Function ("varName", " return this[varName];"));
    } 

</script>