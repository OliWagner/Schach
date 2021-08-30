
$("#btnAnmelden").click(function () {
    let email = $("#txtAnmeldungEmail").val();
    let passwort = $("#txtAnmeldungPasswort").val();

    var value = JSON.stringify({
        email: email,
        passwort: passwort
    });

    var aktiverSpieler;
    var http = new XMLHttpRequest();
    http.open('POST', '/Home/Anmelden', true);
    http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200 && http.responseText != "") {
            $(".divAnzeigeLinks").fadeOut(2000);
            $(".divAnzeigeRechts").fadeOut(2000, function () {
                window.location.href = "/Home/Angemeldet";
            });
        }
    }
    http.send(value); 
});



$("#btnRegistrieren").click(function () {
    let email = $("#txtRegistrierenEmail").val();
    let passwort = $("#txtRegistrierenPasswort").val();
    var value = JSON.stringify({
        email: email,
        passwort: passwort
    });

    var http = new XMLHttpRequest();
    http.open('POST', '/Home/Registrieren', true);
    http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let pw = $("#txtRegistrierenPasswort").val();
            let em = $("#txtRegistrierenEmail").val();
            $("#txtAnmeldungPasswort").val(pw);
            $("#txtAnmeldungEmail").val(em);
            $("#txtRegistrierenEmail").val("");
            $("#txtRegistrierenPasswort").val("");
            alert(http.responseText);
        }
    }
    http.send(value); 
});

