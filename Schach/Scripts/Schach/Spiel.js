var letzterZug = "";

if (letzterZug == "" && EigeneFarbeDesSpielers == "S" && EigeneFarbeDesSpielers != SpielerAmZug) {
    var myIntervalStart = setInterval(function () {
            rufeLetztenWurfVomServerAb(); 
    }, 3000);
}
var myInterval0;


function sendeWurfAnServer(_spielerHatGezogen, _zugVon, _zugNach, _figur) {
    letzterZug = _zugVon.substr(1) + "-" + _zugNach.substr(1);

    let value = JSON.stringify({
        spielerHatGezogen: _spielerHatGezogen,
        zugVon: _zugVon.substr(1),
        zugNach: _zugNach.substr(1),
        figur: _figur
    });

    var http = new XMLHttpRequest();
    http.open('POST', '/Home/ZugEintragen', true);
    http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200 && http.responseText != "") {
            //alert("Zug ist eingetragen");
            myInterval0 = setInterval(function () {
                rufeLetztenWurfVomServerAb();      
            }, 3000);
        }
    }
    http.send(value); 
    setTimeout(function () {
        ReadDataFromChessboard();
    }, 1000);
    
}

function rufeLetztenWurfVomServerAb() {

    var http = new XMLHttpRequest();
    http.open('POST', '/Home/ZugAbfragen', true);
    http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200 && http.responseText != "") {
            let beides = http.responseText.split(';');
            let zug = beides[0];
            let vonNach = zug.split('-');
            let von = vonNach[0];
            let nach = vonNach[1];
            let figur = beides[1];

            if (zug != letzterZug) {
                if (figur == "Bauer") {
                    setzeBauerReturn("#" + nach, SpielerAmZug, "#" +von);
                    if (typeof myIntervalStart !== "undefined") { clearInterval(myIntervalStart); }
                    if (typeof myInterval0 !== "undefined") { clearInterval(myInterval0); }
                }
                else if (figur == "Koenig") {
                    setzeKoenigReturn("#" + nach, SpielerAmZug, "#" +von);
                    if (typeof myIntervalStart !== "undefined") { clearInterval(myIntervalStart); }
                    if (typeof myInterval0 !== "undefined") { clearInterval(myInterval0); }
                }
                else {
                    setzeFigurReturn("#" +nach, SpielerAmZug, "#" +von, figur);
                    if (typeof myIntervalStart !== "undefined") { clearInterval(myIntervalStart); }
                    if (typeof myInterval0 !== "undefined") { clearInterval(myInterval0); }
                }
                
            }
            
        }
        
    }
    http.send();
}
var rochadeReturn = "nein";
function setzeFigurReturn(txt, farbe, feld, figur) {
    resetEnPassant();
    if (rochadeReturn == "nein") {
        setzeSpielerAmZug();
    } else {
        rochadeReturn = "nein";
    }

    if (farbe == "S") {
        if ($(txt).hasClass("weiss")) {
            $(txt).attr('href', '/Content/Schach/Schwarzer' + figur + 'WeissesFeld.svg');
        } else {
            $(txt).attr('href', '/Content/Schach/Schwarzer' + figur + 'SchwarzesFeld.svg');
        }
    } else {
        if ($(txt).hasClass("weiss")) {
            $(txt).attr('href', '/Content/Schach/Weisser' + figur + 'WeissesFeld.svg');
        } else {
            $(txt).attr('href', '/Content/Schach/Weisser' + figur + 'SchwarzesFeld.svg');
        }
    }

    clearField(feld.substr(1));
    $("image").off("click");
}

function setzeKoenigReturn(txt, farbe, feld) {
    resetEnPassant();
    setzeSpielerAmZug();
    if (farbe == "S") {
        if ($(txt).hasClass("weiss")) {
            $(txt).attr('href', '/Content/Schach/SchwarzerKoenigWeissesFeld.svg');
        } else {
            $(txt).attr('href', '/Content/Schach/SchwarzerKoenigSchwarzesFeld.svg');
        }
        //Wenn Rochade dann auch Turm setzen
        if (feld == "#E8" && txt == "#G8") {
            rochadeReturn = "ja";
            setzeFigurReturn("#F8", "S", "#H8", "Turm");
        }
        if (feld == "#E8" && txt == "#B8") {
            rochadeReturn = "ja";
            setzeFigurReturn("#C8", "S", "#A8", "Turm");
        }
    } else {
        if ($(txt).hasClass("weiss")) {
            $(txt).attr('href', '/Content/Schach/WeisserKoenigWeissesFeld.svg');
        } else {
            $(txt).attr('href', '/Content/Schach/WeisserKoenigSchwarzesFeld.svg');
        }
        //Wenn Rochade dann auch Turm setzen
        if (feld == "#E1" && txt == "#G1") {
            rochadeReturn = "ja";
            setzeFigurReturn("#F1", "W", "#H1", "Turm");
        }
        if (feld == "#E1" && txt == "#B1") {
            rochadeReturn = "ja";
            setzeFigurReturn("#C1", "W", "#A1", "Turm");
        }
    }
    clearField(feld.substr(1));
    $("image").off("click");
}

function setzeBauerReturn(zielfeld, farbe, feld) {
    if (enPassant == true && zielfeld == feldZielEnPassant) {
        clearField(feldZuSchlagendeFigurEnPassant.substr(1));
    }
    resetEnPassant();
    setzeSpielerAmZug();
    let figur = "Bauer";
    if (farbe == "S") {
        if (zielfeld.substr(2) == "1") {
            figur = "Dame";
        }
        if ($(zielfeld).hasClass("weiss")) {
            $(zielfeld).attr('href', '/Content/Schach/Schwarzer' + figur + 'WeissesFeld.svg');
        } else {
            $(zielfeld).attr('href', '/Content/Schach/Schwarzer' + figur + 'SchwarzesFeld.svg');
        }
        //Wenn Bauer zwei Felder gegangen ist auf En Passant checken
        if (feld.substr(2) - zielfeld.substr(2) == 2) {
            checkEnPassant(zielfeld, "Weisser");
        }
    } else {
        if (zielfeld.substr(2) == "8") {
            figur = "Dame";
        }
        if ($(zielfeld).hasClass("weiss")) {
            $(zielfeld).attr('href', '/Content/Schach/Weisser' + figur + 'WeissesFeld.svg');
        } else {
            $(zielfeld).attr('href', '/Content/Schach/Weisser' + figur + 'SchwarzesFeld.svg');
        }
        //Wenn Bauer zwei Felder gegangen ist auf En Passant checken
        if (zielfeld.substr(2) - feld.substr(2) == 2) {
            checkEnPassant(zielfeld, "Schwarzer");
        }
    }

    clearField(feld.substr(1));
    $("image").off("click");
}




