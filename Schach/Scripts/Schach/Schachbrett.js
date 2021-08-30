//var SpielerAmZug = "W";
//var EigeneFarbeDesSpielers = "W";

//Beinhaltet den Namen des Bildes
let imageTransporter = "";
//Feld des Bildes
let fieldTransporter = "";
//String für Felder
let abcdefgh = " ABCDEFGH";
$("image").hover(function (source) {
    let arr = source.currentTarget.href.baseVal.split("/");
    imageTransporter = arr[arr.length - 1];
    fieldTransporter = "#" + source.currentTarget.id;
    if (imageTransporter != "Weiss.svg" && imageTransporter != "Schwarz.svg") { 
        if (imageTransporter.substr(0,1) == SpielerAmZug && EigeneFarbeDesSpielers == SpielerAmZug) { 
            $(fieldTransporter).addClass("aktivesFeld");
            $(fieldTransporter).on("click", function () {
                searchFields();
            }); 
        }
    }
}, function () {
        if (imageTransporter != "Weiss.svg" && imageTransporter != "Schwarz.svg") {
            $(fieldTransporter).removeClass("aktivesFeld");
            $(fieldTransporter).off("click");
        }
});

function clearField(source) {
    let text = '#' + source;
    let buchstabe = source.substr(0, 1);
    let nummer = source.substr(1, 1);
    let tester = nummer % 2;
    if ((buchstabe == "A" || buchstabe == "C" || buchstabe == "E" || buchstabe == "G") && tester > 0) {
        $(text).attr('href', '/Content/Schach/Schwarz.svg');
    } else
        if ((buchstabe == "A" || buchstabe == "C" || buchstabe == "E" || buchstabe == "G") && tester == 0) {
            $(text).attr('href', '/Content/Schach/Weiss.svg');
        } else
            if ((buchstabe == "B" || buchstabe == "D" || buchstabe == "F" || buchstabe == "H") && tester == 0) {
                $(text).attr('href', '/Content/Schach/Schwarz.svg');
            } else
                if ((buchstabe == "B" || buchstabe == "D" || buchstabe == "F" || buchstabe == "H") && tester > 0) {
                    $(text).attr('href', '/Content/Schach/Weiss.svg');
                }
}

function searchFields() {
    $("image").off("click");
    //Zuerst die Felder suchen, die eine Figur begehen kann
    let imageText = imageTransporter.split(".")[0];
    if (imageTransporter.includes("Bauer")) {
        searchFieldsBauern(imageTransporter.substr(0,1));
    }

    else if (imageTransporter.includes("Turm")) {
        searchFieldsTurm(imageTransporter.substr(0, 1));
    }

    else if (imageTransporter.includes("Springer")) {
        searchFieldsSpringer(imageTransporter.substr(0, 1));
    }

    else if (imageTransporter.includes("Laeufer")) {
        searchFieldsLaeufer(imageTransporter.substr(0, 1));
    }

    else if (imageTransporter.includes("Koenig")) {
        searchFieldsKoenig(imageTransporter.substr(0, 1));
    }

    else if (imageTransporter.includes("Dame")) {
        searchFieldsDame(imageTransporter.substr(0, 1));
    }
}

function setzeSpielerAmZug() {
    if (SpielerAmZug == "W") {
        SpielerAmZug = "S";
        $("#lblAnzeigeSpielerAmZug").text("Schwarz ist am Zug");
    } else {
        SpielerAmZug = "W";
        $("#lblAnzeigeSpielerAmZug").text("Weiss ist am Zug");
    }
    //Ab hier die Anzeige der bisherigen Züge
    let value = JSON.stringify({
        partieId: IdDesLaufendenSpiels
    });

    var _http = new XMLHttpRequest();
    _http.open('POST', '/Home/LeseZuege', true);
    _http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    _http.onreadystatechange = function () {
        if (_http.readyState == 4 && _http.status == 200 && _http.responseText != "") {
            let vals = JSON.parse(_http.responseText);
            $("#divAnzeigeZuege").empty();
            vals.forEach(function (item) {
                let classTxt = item.SpielerHatGezogen == "W" ? "zugWeiss" : "zugSchwarz";
                $("#divAnzeigeZuege").append("<label class='" + classTxt + "'>(" + item.Figur.substr(0,1) + ")" + item.Zuhg + "</label>");
            });
        }
    }
    _http.send(value); 
}

var esIstEineRochade = "nein";
function setzeFigur(txt, farbe, feld, figur) {
    resetEnPassant();
    
    if (esIstEineRochade == "nein") {
        sendeWurfAnServer(farbe, feld, txt, figur);
        setzeSpielerAmZug();
    } else {
        esIstEineRochade = "nein";
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

function setzeKoenig(txt, farbe, feld) {
    resetEnPassant();
    sendeWurfAnServer(farbe, feld, txt, "Koenig");
    setzeSpielerAmZug();
    if (farbe == "S") {
        if ($(txt).hasClass("weiss")) {
            $(txt).attr('href', '/Content/Schach/SchwarzerKoenigWeissesFeld.svg');
        } else {
            $(txt).attr('href', '/Content/Schach/SchwarzerKoenigSchwarzesFeld.svg');
        }
        //Wenn Rochade dann auch Turm setzen
        if (feld == "#E8" && txt == "#G8") {
            esIstEineRochade = "ja";
            setzeFigur("#F8", "S", "#H8", "Turm");
        }
        if (feld == "#E8" && txt == "#B8") {
            esIstEineRochade = "ja";
            setzeFigur("#C8", "S", "#A8", "Turm");
        }


    } else {
        if ($(txt).hasClass("weiss")) {
            $(txt).attr('href', '/Content/Schach/WeisserKoenigWeissesFeld.svg');
        } else {
            $(txt).attr('href', '/Content/Schach/WeisserKoenigSchwarzesFeld.svg');
        }
        //Wenn Rochade dann auch Turm setzen
        if (feld == "#E1" && txt == "#G1") {
            esIstEineRochade = "ja";
            setzeFigur("#F1", "W", "#H1", "Turm");
        }
        if (feld == "#E1" && txt == "#B1") {
            esIstEineRochade = "ja";
            setzeFigur("#C1", "W", "#A1", "Turm");
        }
    }

    clearField(feld.substr(1));
    $("image").off("click");
}

function setzeBauer(zielfeld, farbe, feld) {
    if (enPassant == true && zielfeld == feldZielEnPassant) {
        clearField(feldZuSchlagendeFigurEnPassant.substr(1));
    }
    resetEnPassant();
    sendeWurfAnServer(farbe, feld, zielfeld, "Bauer");
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

var enPassant = false;
var feldZielEnPassant = "";
var feldZuSchlagendeFigurEnPassant = "";
var feldLinksEnPassant = "";
var feldRechtsEnPassant = "";
//farbe gibt die Farbe der Figur an, die nach dem Zug enPassant schlagen könnte
function checkEnPassant(_feldZuSchlagendeFigur, _farbe) {
    let spalte = _feldZuSchlagendeFigur.substr(1, 1);
    let spaltennummer = abcdefgh.indexOf(spalte);
    let zeile = _feldZuSchlagendeFigur.substr(2);
    let grundfarbeFeld = $(_feldZuSchlagendeFigur).attr('class');

    //links und rechts von dem Feld schauen, ob da ein anderer Bauer steht
    if (spaltennummer == 1) {
        let xx = "#B" + zeile;
        let bez = $(xx).attr('href');
        if (bez.includes(_farbe + "Bauer")) {
            enPassant = true;
            feldZuSchlagendeFigurEnPassant = _feldZuSchlagendeFigur;
            feldLinksEnPassant = "";
            feldRechtsEnPassant = xx;
            if (_farbe.substr(0, 1) == "W") {
                //Zielfigur ist schwarz
                let int = zeile * 1 + 1;
                feldZielEnPassant = "#" + spalte + int;
            } else {
                //Zielfigur ist weiss
                let int = zeile - 1 * 1;
                feldZielEnPassant = "#" + spalte + int;
            }
        }
    }
    else if (spaltennummer == 8) {
        let xx = "#G" + zeile;
        let bez = $(xx).attr('href');
        if (bez.includes(_farbe + "Bauer")) {
            enPassant = true;
            feldZuSchlagendeFigurEnPassant = _feldZuSchlagendeFigur;
            feldLinksEnPassant = xx;
            feldRechtsEnPassant = "";
            if (_farbe.substr(0, 1) == "W") {
                //Zielfigur ist schwarz
                let int = zeile * 1 + 1;
                feldZielEnPassant = "#" + spalte + int;
            } else {
                //Zielfigur ist weiss
                let int = zeile - 1 * 1;
                feldZielEnPassant = "#" + spalte + int;
            }
        }
    }
    else {
        let xxlinks = "#" + abcdefgh[spaltennummer - 1] + zeile;
        let bezlinks = $(xxlinks).attr('href');
        if (bezlinks.includes(_farbe + "Bauer")) {
            enPassant = true;
            feldZuSchlagendeFigurEnPassant = _feldZuSchlagendeFigur;
            feldLinksEnPassant = xxlinks;
            if (_farbe.substr(0, 1) == "W") {
                //Zielfigur ist schwarz
                let int = zeile * 1 + 1;
                feldZielEnPassant = "#" + spalte + int;
            } else {
                //Zielfigur ist weiss
                let int = zeile - 1 * 1;
                feldZielEnPassant = "#" + spalte + int;
            }
        }
        let xxrechts = "#" + abcdefgh[spaltennummer + 1 * 1] + zeile;
        let bezrechts = $(xxrechts).attr('href');
        if (bezrechts.includes(_farbe + "Bauer")) {
            enPassant = true;
            feldZuSchlagendeFigurEnPassant = _feldZuSchlagendeFigur;
            feldRechtsEnPassant = xxrechts;
            if (_farbe.substr(0, 1) == "W") {
                //Zielfigur ist schwarz
                let int = zeile * 1 + 1;
                feldZielEnPassant = "#" + spalte + int;
            } else {
                //Zielfigur ist weiss
                let int = zeile - 1 * 1;
                feldZielEnPassant = "#" + spalte + int;
            }
        }
        let trot = 0;
    }




}
function resetEnPassant() {
    enPassant = false;
    feldZielEnPassant = "";
    feldZuSchlagendeFigurEnPassant = "";
    feldLinksEnPassant = "";
    feldRechtsEnPassant = "";
}

function searchFieldsBauern(farbe) {
    let _farbe = farbe;
    let _feld = fieldTransporter;
    let _spalte = fieldTransporter.substr(1, 1);
    let _zeile = fieldTransporter.substr(2, 1);

    //auf En Passant achten
    if (_feld == feldLinksEnPassant || _feld == feldRechtsEnPassant) {
        $(feldZielEnPassant).click(function () {
            setzeBauer(feldZielEnPassant, _farbe, _feld);
        });
    }


    if (_farbe == "S") {
        //Es wird von oben nach unten gezogen
        
        if (_zeile == 7) {
            //Bauer kann zwei Felder ziehen

            let txt = "#" + _spalte + (_zeile - 1);
            let testerei = $(txt).attr("href");
            testerei = testerei.split("/")[3];
            if (testerei.length < 12) {
                $(txt).click(function () {
                    setzeBauer(txt, _farbe, _feld);
                });

                let txt2 = "#" + _spalte + (_zeile - 2);
                let testerei2 = $(txt2).attr("href");
                testerei2 = testerei2.split("/")[3];
                if (testerei2.length < 12) {
                    $(txt2).click(function () {
                        setzeBauer(txt2, _farbe, _feld);
                    });
                }
            }
        } else {

            let txt3 = "#" + _spalte + (_zeile - 1);
            let testerei3 = $(txt3).attr("href");
            testerei3 = testerei3.split("/")[3];
            if (testerei3.length < 12) {
                $(txt3).click(function () {
                    setzeBauer(txt3, _farbe, _feld);
                });
            }
        }
        //Diagonal Felder prüfen, ob man etwas schlagen kann
        let ziffer = abcdefgh.indexOf(_spalte);
        if (ziffer == 1) {
            let txtd1 = "#B" + (_zeile - 1);
            let testereid1 = $(txtd1).attr("href");
            testereid1 = testereid1.split("/")[3];
            if (testereid1.length > 12 && testereid1.substr(0, 1) ==  "W") {
                $(txtd1).click(function () {
                    setzeBauer(txtd1, _farbe, _feld);
                });
            }
        }
        else if (ziffer == 8) {
            let txtd2 = "#G" + (_zeile - 1);
            let testereid2 = $(txtd2).attr("href");
            testereid2 = testereid2.split("/")[3];
            if (testereid2.length > 12 && testereid2.substr(0,1) == "W") {
                $(txtd2).click(function () {
                    setzeBauer(txtd2, _farbe, _feld);
                });
            }
        }
        else {
            let txtd3 = "#" + abcdefgh[ziffer - 1] + (_zeile - 1);
            let testereid3 = $(txtd3).attr("href");
            testereid3 = testereid3.split("/")[3];
            if (testereid3.length > 12 && testereid3.substr(0, 1) == "W") {
                $(txtd3).click(function () {
                    setzeBauer(txtd3, _farbe, _feld);
                });
            }
            let txtd4 = "#" + abcdefgh[ziffer + 1] + (_zeile - 1);
            let testereid4 = $(txtd4).attr("href");
            testereid4 = testereid4.split("/")[3];
            if (testereid4.length > 12 && testereid4.substr(0, 1) == "W") {
                $(txtd4).click(function () {
                    setzeBauer(txtd4, _farbe, _feld);
                });
            }
        }
    }
    else
    {
        //Es wird von unten nach oben gezogen
        if (_zeile == 2) {
            //Bauer kann zwei Felder ziehen
            let txt4 = "#" + _spalte + (_zeile * 1 + 1);
            let testerei4 = $(txt4).attr("href");
            testerei4 = testerei4.split("/")[3];
            if (testerei4.length < 12) {
                $(txt4).click(function () {
                    setzeBauer(txt4, _farbe, _feld);
                });
            }

            let txt5 = "#" + _spalte + (_zeile * 1 + 2);
            let testerei5 = $(txt5).attr("href");
            testerei5 = testerei5.split("/")[3];
            if (testerei5.length < 12) {
                $(txt5).click(function () {
                    setzeBauer(txt5, _farbe, _feld);
                });
            }
        } else {
            let txt6 = "#" + _spalte + (_zeile * 1 + 1);
            let testerei6 = $(txt6).attr("href");
            testerei6 = testerei6.split("/")[3];
            if (testerei6.length < 12) {
                $(txt6).click(function () {
                    setzeBauer(txt6, _farbe, _feld);
                });
            }
        }
        //DIagonal
        let ziffer = abcdefgh.indexOf(_spalte);
        if (ziffer == 1) {
            let txtd1 = "#B" + (_zeile * 1 + 1);
            let testereid1 = $(txtd1).attr("href");
            testereid1 = testereid1.split("/")[3];
            if (testereid1.length > 12 && testereid1.substr(0, 1) == "S") {
                $(txtd1).click(function () {
                    setzeBauer(txtd1, _farbe, _feld);
                });
            }
        }
        else if (ziffer == 8) {
            let txtd2 = "#G" + (_zeile * 1 + 1);
            let testereid2 = $(txtd2).attr("href");
            testereid2 = testereid2.split("/")[3];
            if (testereid2.length > 12 && testereid2.substr(0, 1) == "S") {
                $(txtd2).click(function () {
                    setzeBauer(txtd2, _farbe, _feld);
                });
            }
        }
        else {
            let txtd3 = "#" + abcdefgh[ziffer - 1] + (_zeile * 1 + 1);
            let testereid3 = $(txtd3).attr("href");
            testereid3 = testereid3.split("/")[3];
            if (testereid3.length > 12 && testereid3.substr(0, 1) == "S") {
                $(txtd3).click(function () {
                    setzeBauer(txtd3, _farbe, _feld);
                });
            }
            let txtd4 = "#" + abcdefgh[ziffer + 1] + (_zeile * 1 + 1);
            let testereid4 = $(txtd4).attr("href");
            testereid4 = testereid4.split("/")[3];
            if (testereid4.length > 12 && testereid4.substr(0, 1) == "S") {
                $(txtd4).click(function () {
                    setzeBauer(txtd4, _farbe, _feld);
                });
            }
        }
    }
}

function searchFieldsSpringer(farbe) {
    let _farbe = farbe;
    let _feld = fieldTransporter;
    let _spalte = abcdefgh.indexOf(fieldTransporter.substr(1, 1));
    let _zeile = fieldTransporter.substr(2, 1);

    let _nachoben = _zeile * 1 + 2;
    let _nachlinks = _spalte - 2;
    let _nachrechts = _spalte * 1 + 2;
    let _nachunten = _zeile - 2;
    let _felder = [];

    if (_nachoben < 9) {
        //nach links testen
        if (_nachlinks >= 0) {
            _felder.push("#" + abcdefgh[_spalte - 1] + (_nachoben));
        }
        //nach rechts testen
        if (_nachrechts <= 9) {
            _felder.push("#" + abcdefgh[_spalte * 1 + 1] + (_nachoben));
        }
    }

    if (_nachunten > 0) {
        //nach links testen
        if (_nachlinks >= 0) {
            _felder.push("#" + abcdefgh[_spalte - 1] + (_nachunten));
        }
        //nach rechts testen
        if (_nachrechts <= 9) {
            _felder.push("#" + abcdefgh[_spalte * 1 + 1] + (_nachunten));
        }
    }

    if (_nachlinks > 0) {
        //nach oben testen
        if (_nachoben <= 9) {
            _felder.push("#" + abcdefgh[_nachlinks] + (_zeile * 1 + 1));
        }
        //nach unten testen
        if (_nachunten >= 0) {
            _felder.push("#" + abcdefgh[_nachlinks] + (_zeile - 1));
        }
        
    }

    if (_nachrechts < 9) {
        //nach oben testen
        if (_nachoben <= 9) {
            _felder.push("#" + abcdefgh[_nachrechts] + (_zeile * 1 + 1));
        }
        //nach unten testen
        if (_nachunten >= 0) {
            _felder.push("#" + abcdefgh[_nachrechts] + (_zeile - 1));
        }
    }
    
    _felder.forEach(function (item){
        let testaeterae = $(item).attr("href");
        testaeterae = testaeterae.split("/")[3];
        if (testaeterae.length < 12 || (testaeterae.length > 12 && testaeterae.substr(0,1) != _farbe)) { 
            $(item).click(function () {
                setzeFigur(item, _farbe, _feld, "Springer");
            });
        }
    });
}

function searchFieldsKoenig(farbe) {
    let _farbe = farbe;
    let _feld = fieldTransporter;
    let _spalte = fieldTransporter.substr(1, 1);
    let _zeile = fieldTransporter.substr(2, 1);

    //nach oben/unten jeweils links und rechts mitchecken
    let _nachoben = _zeile * 1 + 1;
    let _nachlinks = abcdefgh.indexOf(_spalte) - 1;
    let _nachrechts = abcdefgh.indexOf(_spalte) * 1 + 1;
    let _nachunten = _zeile - 1;
    let _felder = [];

    if (_nachoben < 9) {
        //nach links testen
        if (_nachlinks > 0) {
            _felder.push("#" + abcdefgh[_nachlinks] + (_nachoben));
        }
        //nach rechts testen
        if (_nachrechts < 9) {
            _felder.push("#" + abcdefgh[_nachrechts] + (_nachoben));
        }
        //nach oben testen
        if (_nachrechts < 9) {
            _felder.push("#" + abcdefgh[abcdefgh.indexOf(_spalte)] + (_nachoben));
        }
    }

    if (_nachunten > 0) {
        //nach links testen
        if (_nachlinks > 0) {
            _felder.push("#" + abcdefgh[_nachlinks] + (_nachunten));
        }
        //nach rechts testen
        if (_nachrechts < 9) {
            _felder.push("#" + abcdefgh[_nachrechts] + (_nachunten));
        }
        //nach unten testen
        if (_nachrechts < 9) {
            _felder.push("#" + abcdefgh[abcdefgh.indexOf(_spalte)] + (_nachunten));
        }
    }

    if (_nachlinks > 0) {
        _felder.push("#" + abcdefgh[_nachlinks] + (_zeile));
    }

    if (_nachrechts < 9) {
        _felder.push("#" + abcdefgh[_nachrechts] + (_zeile));
    }

    //Auf Rochade testen
    if(farbe == "W"){
        if (fieldTransporter == "#E1") {
            if ($("#D1").attr("href") == "/Content/Schach/Weiss.svg") {
                if ($("#C1").attr("href") == "/Content/Schach/Schwarz.svg") {
                    if ($("#B1").attr("href") == "/Content/Schach/Weiss.svg") {
                        if ($("#A1").attr("href") == "/Content/Schach/WeisserTurmSchwarzesFeld.svg") {
                            _felder.push("#B1");
                        }
                    }
                }
            }

            if ($("#F1").attr("href") == "/Content/Schach/Weiss.svg") {
                if ($("#G1").attr("href") == "/Content/Schach/Schwarz.svg") {
                    if ($("#H1").attr("href") == "/Content/Schach/WeisserTurmWeissesFeld.svg") {
                        _felder.push("#G1");
                    }
                }
            }
        }
    }

    if (farbe == "S") {
        if (fieldTransporter == "#E8") {
            if ($("#D8").attr("href") == "/Content/Schach/Schwarz.svg") {
                if ($("#C8").attr("href") == "/Content/Schach/Weiss.svg") {
                    if ($("#B8").attr("href") == "/Content/Schach/Schwarz.svg") {
                        if ($("#A8").attr("href") == "/Content/Schach/SchwarzerTurmWeissesFeld.svg") {
                            _felder.push("#B8");
                        }
                    }
                }
            }

            if ($("#F8").attr("href") == "/Content/Schach/Schwarz.svg") {
                if ($("#G8").attr("href") == "/Content/Schach/Weiss.svg") {
                    if ($("#H8").attr("href") == "/Content/Schach/SchwarzerTurmSchwarzesFeld.svg") {
                        _felder.push("#G8");
                    }
                }
            }
        }
    }
    

    _felder.forEach(function (item) {
        let testaeterae = $(item).attr("href");
        testaeterae = testaeterae.split("/")[3];
        if (testaeterae.length < 12 || (testaeterae.length > 12 && testaeterae.substr(0, 1) != _farbe)) {
            $(item).click(function () {
                setzeKoenig(item, _farbe, _feld);
            });
        }
    });
}

function searchFieldsTurm(farbe) {
    let _farbe = farbe;
    let _feld = fieldTransporter;
    let _spalte = fieldTransporter.substr(1, 1);
    let _spaltennummer = abcdefgh.indexOf(_spalte);
    let _zeile = fieldTransporter.substr(2, 1) * 1;


    let _felder = [];

    //nach oben
    
    for (let i = _zeile + 1; i <= 8; i++) {
        let tst = $("#" + _spalte + i).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + _spalte + i);
        } else
        if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
            _felder.push("#" + _spalte + i);
            break;;
        } else {
            break;
        }
        
    } 
    //nach unten
    for (let i = _zeile - 1; i >= 1; i--) {
        let tst = $("#" + _spalte + i).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + _spalte + i);
        } else
        if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
            _felder.push("#" + _spalte + i);
            break;;
        } else {
            break;
        }
    } 
    //nach rechts
    for (let i = _spaltennummer + 1; i <= 8; i++) {
        let tst = $("#" + abcdefgh[i] + _zeile).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + abcdefgh[i] + _zeile);
        } else
        if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
            _felder.push("#" + abcdefgh[i] + _zeile);
            break;;
        } else {
            break;
        }
    } 
    //nach links
    for (let i = _spaltennummer - 1; i >= 1; i--) {
        let tst = $("#" + abcdefgh[i] + _zeile).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + abcdefgh[i] + _zeile);
        } else
        if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
            _felder.push("#" + abcdefgh[i] + _zeile);
            break;;
        } else {
            break;
        }
    } 

    _felder.forEach(function (item) {
            $(item).click(function () {
                setzeFigur(item, _farbe, _feld, "Turm");
            });
    });
}

function searchFieldsLaeufer(farbe) {
    let _farbe = farbe;
    let _feld = fieldTransporter;
    let _spalte = fieldTransporter.substr(1, 1);
    let _spaltennummer = abcdefgh.indexOf(_spalte);
    let _zeile = fieldTransporter.substr(2, 1) * 1;

    let _felder = [];

    //nach rechts oben
    let counter = 1;
    for (let i = _zeile + 1; i <= 8; i++) {
        if (_spaltennummer + counter <= 8) { 
            let tst = $("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
            } else
            if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
                break;;
            } else {
                break;
            }
        }
        counter++;
    } 

    //Nach rechts unten
    counter = 1;
    for (let i = _zeile - 1; i >= 1; i--) {
        if (_spaltennummer + counter <= 8) {
            let tst = $("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
            } else
                if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                    _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
                    break;;
                } else {
                    break;
                }

        }
        counter++;
    } 

    //nach links oben
    counter = 1;
    for (let i = _zeile + 1; i <= 8; i++) {
        if (_spaltennummer - counter >= 1) {
            let tst = $("#" + (abcdefgh[_spaltennummer - counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
            } else
            if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
                break;;
            } else {
                break;
            }
        }
        counter++;
    } 

    //nach links unten
    counter = 1;
    for (let i = _zeile - 1; i >= 1; i--) {
        if (_spaltennummer - counter >= 1) {
            let tst = $("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
            } else
                if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                    _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
                    break;;
                } else {
                    break;
                }
        }
        counter++;
    } 

    _felder.forEach(function (item) {
        $(item).click(function () {
            setzeFigur(item, _farbe, _feld, "Laeufer");
        });
    });
}

function searchFieldsDame(farbe) {
    let _farbe = farbe;
    let _feld = fieldTransporter;
    let _spalte = fieldTransporter.substr(1, 1);
    let _spaltennummer = abcdefgh.indexOf(_spalte);
    let _zeile = fieldTransporter.substr(2, 1) * 1;

    let _felder = [];

    //nach rechts oben
    let counter = 1;
    for (let i = _zeile + 1; i <= 8; i++) {
        if (_spaltennummer + counter <= 8) {
            let tst = $("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
            } else
                if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                    _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
                    break;;
                } else {
                    break;
                }
        }
        counter++;
    }

    //Nach rechts unten
    counter = 1;
    for (let i = _zeile - 1; i >= 1; i--) {
        if (_spaltennummer + counter <= 8) {
            let tst = $("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
            } else
                if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                    _felder.push("#" + (abcdefgh[_spaltennummer * 1 + counter]) + i);
                    break;;
                } else {
                    break;
                }

        }
        counter++;
    }

    //nach links oben
    counter = 1;
    for (let i = _zeile + 1; i <= 8; i++) {
        if (_spaltennummer - counter >= 1) {
            let tst = $("#" + (abcdefgh[_spaltennummer - counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
            } else
                if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                    _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
                    break;;
                } else {
                    break;
                }
        }
        counter++;
    }

    //nach links unten
    counter = 1;
    for (let i = _zeile - 1; i >= 1; i--) {
        if (_spaltennummer - counter >= 1) {
            let tst = $("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i).attr("href");
            tst = tst.split("/")[3];
            if (tst.length < 12) {
                _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
            } else
                if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                    _felder.push("#" + (abcdefgh[_spaltennummer * 1 - counter]) + i);
                    break;;
                } else {
                    break;
                }
        }
        counter++;
    } 

    //nach oben

    for (let i = _zeile + 1; i <= 8; i++) {
        let tst = $("#" + _spalte + i).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + _spalte + i);
        } else
            if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                _felder.push("#" + _spalte + i);
                break;;
            } else {
                break;
            }

    }
    //nach unten
    for (let i = _zeile - 1; i >= 1; i--) {
        let tst = $("#" + _spalte + i).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + _spalte + i);
        } else
            if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                _felder.push("#" + _spalte + i);
                break;;
            } else {
                break;
            }
    }
    //nach rechts
    for (let i = _spaltennummer + 1; i <= 8; i++) {
        let tst = $("#" + abcdefgh[i] + _zeile).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + abcdefgh[i] + _zeile);
        } else
            if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                _felder.push("#" + abcdefgh[i] + _zeile);
                break;;
            } else {
                break;
            }
    }
    //nach links
    for (let i = _spaltennummer - 1; i >= 1; i--) {
        let tst = $("#" + abcdefgh[i] + _zeile).attr("href");
        tst = tst.split("/")[3];
        if (tst.length < 12) {
            _felder.push("#" + abcdefgh[i] + _zeile);
        } else
            if (tst.length > 12 && tst.substr(0, 1) != _farbe) {
                _felder.push("#" + abcdefgh[i] + _zeile);
                break;;
            } else {
                break;
            }
    }

    _felder.forEach(function (item) {
        $(item).click(function () {
            setzeFigur(item, _farbe, _feld, "Dame");
        });
    });
}

