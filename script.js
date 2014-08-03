// global
var matchNbr = 0;
var scorerNbr = 0;
var fairPlayNbr = 0;
var teamNbr = 0;

function setOpac(el,i) {
        el.style.opacity = i/100;
    }
    
function blendIn(el,speed) {
    if ( speed === undefined ) {
      speed = 2;
    }       
    var i = 1;
    //starte Intervall, setze Opacity, erhöhe i um speed und gucke, ob maximale Opacity erreicht ist. Wenn ja, setze i auf max und beende nächste mal das Intervall
    var id = setInterval(function(){if(i==100){clearInterval(id);}setOpac(el,i);i+=speed;if(i>100){i=100;}},10);                
}
            
function blendOut(el,speed) {
    if ( speed === undefined ) {
      speed = 2;
    }       
    var i = 100;
    //starte Intervall, setze Opacity, erhöhe i um speed und gucke, ob maximale Opacity erreicht ist. Wenn ja, setze i auf max und beende nächste mal das Intervall
    var id = setInterval(function(){if(i===0){clearInterval(id);showHide(el);}setOpac(el,i);i-=speed;if(i<0){i=0;}},10);              
} 
 
function showHide(el) {
    if(el.style.display == "none") {
        el.style.display = "block";
    }
    else
        el.style.display = "none";
}

function clrInput(el,phrase) 
{
    if(el.value==phrase) el.value="";
}

function del(el) 
{
    el = el.parentNode;
    el.parentNode.removeChild(el);
}

function toggleLists() {
    var fp = document.getElementById("input-show-fairplay");
    var scorer = document.getElementById("input-show-scorers");
    if(fp.checked) {
        document.getElementById("navfairplay").style.display = "inline";
        document.getElementById("fairplaytab").style.display = "table";
    }
    else {
        document.getElementById("navfairplay").style.display = "none";
        document.getElementById("fairplaytab").style.display = "none";
    }
    if(scorer.checked) {
        document.getElementById("navtore").style.display = "inline";
        document.getElementById("torschuetzen").style.display = "table";
    }
    else {
        document.getElementById("navtore").style.display = "none";
        document.getElementById("torschuetzen").style.display = "none";
    }
}

function startTournament() 
{
    var del = document.getElementsByName("ateamloeschen");
    var len = del.length;
    for(var i=0; i<len; i++) 
    {
        del[i].style.display = "none";
    }
    document.getElementById("addteam").parentNode.removeChild(document.getElementById("addteam"));
    document.getElementById("losbutton").parentNode.removeChild(document.getElementById("losbutton"));
    createGemaplan();
    initTable();     
    showHide(document.getElementById("navi")); 
    showHide(document.getElementById("loadlink"));
    document.getElementById("savebutton").style.display = "inline-block";         
    
    navigateTo("fsspielplan");
    //notification("geht los");
}
            
function addTeam() 
{
    var el = document.getElementById("teamliste");
    //DIV für Teamreihe
    var newElTeam = document.createElement("div");
    newElTeam.className = "teamrow";
    //Eingabefeld für den Namen
    var inputEl = document.createElement("input");
    inputEl.id = "team" + teamNbr++;
    inputEl.className = "input teams";
    inputEl.name = "team";
    inputEl.placeholder = "Name";
    newElTeam.appendChild(inputEl);
    //Team löschen Button;
    var linkEl = document.createElement("a");
    linkEl.href = "#";
    linkEl.innerHTML = "[-]";
    linkEl.title = "Team löschen";
    linkEl.id = "ateamloeschen";
    linkEl.name = "ateamloeschen";
    linkEl.setAttribute("onclick","del(this)");
    newElTeam.appendChild(linkEl);
// finales hinzufügen des elements
    el.insertBefore(newElTeam, el.firstChild);
}

function addGoalScorer() 
{
    var el = document.getElementById("torschuetzenliste");
    //DIV für Scorernreihe
    var newElScorer = document.createElement("div");
    newElScorer.className = "scorerrow";
    newElScorer.id = "scorerrow" + scorerNbr;
    
    //Dropdown für Team
    var selectEl = document.createElement("select");
    selectEl.size = "1";
    selectEl.name = "torteams";
    selectEl.setAttribute("onchange","this.disabled='disabled';");
    selectEl.setAttribute("ondblclick","this.removeAttribute('disabled');");
    newElScorer.appendChild(selectEl);
    //Auswahloptionen für Dropdown
    var anz = getNmbrOfTeams();
    for(var i = 0; i<anz; i++) 
    {
        var optionsEl = document.createElement("option");
        optionsEl.innerHTML = "team" + i;
        optionsEl.innerHTML = getTeamNameById(i);
        newElScorer.lastChild.appendChild(optionsEl);
    }
    //Eingabefeld für den Scorernnamen
    var inputEl = document.createElement("input");
    inputEl.id = "scorer" + scorerNbr;
    inputEl.className = "input scorers";
    inputEl.name = "scorer";
    inputEl.placeholder = "Scorer ";
    inputEl.setAttribute("ondblclick","this.nextSibling.removeAttribute('disabled');");
    newElScorer.appendChild(inputEl);

    //Anzahl der Tore
    var spanEl = document.createElement("span");
    spanEl.contentEditable = "true";
    spanEl.id = "goalsscorer" + scorerNbr;
    spanEl.className = "standing";
    spanEl.name = "goals";
    spanEl.innerHTML = "0";
    spanEl.size = "2";
    spanEl.setAttribute("disabled", "disabled");
    newElScorer.appendChild(spanEl);
    //Add goal;
    var linkEl = document.createElement("a");
    linkEl.href = "#";
    linkEl.innerHTML = "[+1]";
    linkEl.title = "Add goal";
    linkEl.id = "atorplus" + scorerNbr;
    linkEl.name = "atorplus";
    linkEl.setAttribute("onclick","change(this,event);");
    newElScorer.appendChild(linkEl);
    
    scorerNbr++;
    el.insertBefore(newElScorer, el.firstChild);
}

function addFairPlay() 
{
    var el = document.getElementById("fairplayliste");              
    //DIV für Teamreihe
    var newElPlayer = document.createElement("div");
    newElPlayer.className = "fairplayrow";              
    //Dropdown für Team
    var selectEl = document.createElement("select");
    selectEl.size = "1";
    selectEl.name = "fairplayteams";
    selectEl.setAttribute("onchange","this.disabled='disabled';");             
    newElPlayer.appendChild(selectEl);
    //Auswahloptionen für Dropdown
    var anz = getNmbrOfTeams();
    for(var i = 0; i<anz; i++) 
    {
        var newEl = document.createElement("option");
        newEl.innerHTML = "team" + i;
        newEl.innerHTML = getTeamNameById(i);
        newElPlayer.lastChild.appendChild(newEl);
    }
    //Eingabefeld für den Player namen
    var inputEl = document.createElement("input");
    inputEl.id = "spieler" + fairPlayNbr;
    inputEl.className = "input fairplay";
    inputEl.name = "spieler";
    inputEl.placeholder = "Player name";
    inputEl.setAttribute("ondblclick","this.nextSibling.removeAttribute('disabled');");
    newElPlayer.appendChild(inputEl);

//Anzahl der Gelb
var spanEl = document.createElement("span");
    spanEl.contentEditable = "true";
    spanEl.id = "gelb" + fairPlayNbr;
    spanEl.className = "gelb standing";
    spanEl.name = "gelb";
    spanEl.innerHTML = "0";
    spanEl.size = "2";
    spanEl.setAttribute("disabled", "disabled");
    newElPlayer.appendChild(spanEl);
var linkEl = document.createElement("a");
    linkEl.href = "#";
    linkEl.innerHTML = "[Gelb]";
    linkEl.title = "Gelbe Karte";
    linkEl.id = "agelb";
    linkEl.name = "agelb";
    linkEl.setAttribute("onclick","change(this,event);checkBan(this,'gelb')");
    newElPlayer.appendChild(linkEl);
//Anzahl der Gelb-Rot
var spanElRedYellow = document.createElement("span");
    spanElRedYellow.contentEditable = "true";
    spanElRedYellow.id = "gelbrot" + fairPlayNbr;
    spanElRedYellow.className = "gelbrot standing";
    spanElRedYellow.name = "gelbrot";
    spanElRedYellow.innerHTML = "0";
    spanElRedYellow.size = "2";
    spanElRedYellow.setAttribute("disabled", "disabled");
    newElPlayer.appendChild(spanElRedYellow);
var linkElRedYellow = document.createElement("a");
    linkElRedYellow.href = "#";
    linkElRedYellow.innerHTML = "[Gelb-Rot]";
    linkElRedYellow.title = "Gelb-Rot";
    linkElRedYellow.id = "agelbrot";
    linkElRedYellow.name = "agelbrot";
    linkElRedYellow.setAttribute("onclick","if(this.previousSibling.previousSibling.previousSibling.innerHTML >0) {change(this,event);changeYellow(this,event);checkBan(this,'gelbrot')};");
    newElPlayer.appendChild(linkElRedYellow);
//Anzahl der Rot
var spanElRed = document.createElement("span");
    spanElRed.contentEditable = "true";
    spanElRed.id = "rot" + fairPlayNbr;
    spanElRed.className = "rot standing";
    spanElRed.name = "rot";
    spanElRed.innerHTML = "0";
    spanElRed.size = "2";
    spanElRed.setAttribute("disabled", "disabled");
    newElPlayer.appendChild(spanElRed);
var linkElRed = document.createElement("a");
    linkElRed.href = "#";
    linkElRed.innerHTML = "[Rot]";
    linkElRed.title = "Rote Karte";
    linkElRed.id = "arot";
    linkElRed.name = "arot";
    linkElRed.setAttribute("onclick","change(this,event);checkBan(this,'rot')");
    newElPlayer.appendChild(linkElRed);
//Sperren
var spanElBans = document.createElement("span");
    spanElBans.id = "sperre" + fairPlayNbr;
    spanElBans.className = "sperre";
    spanElBans.innerHTML = "0";
    spanElBans.style.display = "none";
    newElPlayer.appendChild(spanElBans);
fairPlayNbr++;
// finales hinzufügen   
el.insertBefore(newElPlayer, el.firstChild);
}           

function change(el,event) 
{
    var val = parseInt(el.previousSibling.innerHTML);
    el.previousSibling.innerHTML = ++val;
}

function changeYellow(el,event) 
{
    var val = parseInt(el.previousSibling.previousSibling.previousSibling.innerHTML);
    el.previousSibling.previousSibling.previousSibling.innerHTML = event.metaKey?(val+1):(val-1);
}

function notification(message) 
{
    var el = document.getElementById("notification");
    el.innerHTML = message;
    showHide(el);
    blendIn(el,10);
    setTimeout(function(){blendOut(el,0.75);}, 2000);   
}

function createGemaplan()
{   
    var spielplan = document.getElementById("spielplan");
    var rrunde = document.getElementById("inputrrunde").checked;
    rrunde = (rrunde)?2:1;
    var anzSpieltag = 0;
    var anzTeams = getNmbrOfTeams();    
    var teams = new Array(anzTeams);                    
    for(var i = 0; i < anzTeams; i++) { teams[i] = i; }
    var gerade = (anzTeams % 2 === 0)?true:false;            //Anzahl der Teams gerade?
    anzTeams = (gerade)?(anzTeams-1):anzTeams;              //Wenn gerade, mache sie ungerade                                   
    var mitte = (anzTeams+1)/2;
    for(var k = 0; k < (anzTeams*rrunde); k++)              //
    {
        var buffer = teams[anzTeams-1];
        for(var j = anzTeams-1; j > 0; j--)
        {           
            teams[j] = teams[j-1];                      
        }
        teams[0] = buffer;                  

        var matchGroup = document.createElement("div");
        matchGroup.className = "matchGroup";
        matchGroup.appendChild(drawGameplanLbl("Spieltag " + (++anzSpieltag)));
        if(gerade) matchGroup.appendChild(drawMatch(teams[anzTeams],teams[0]));     //Wenn gerade, dann beziehe die ausgelassene mit ein
        for(var j2 = 1; j2 < mitte; j2++)
        {
            var team1 = teams[(mitte-(j2-1))-1];
            var team2 = teams[(mitte+j2)-1];
            matchGroup.appendChild(drawMatch(team1,team2));
        }
        spielplan.appendChild(matchGroup);
    }           
}

function drawMatch(team1,team2) 
{
    var newElMatch = document.createElement("div");
    newElMatch.id = "begegnung" + matchNbr++;
    newElMatch.className = "begegnungen";
    
        var spanElTeam1 = document.createElement("span");
        spanElTeam1.className = "nameteam" + team1;
        spanElTeam1.innerHTML = getTeamNameById(team1);
        newElMatch.appendChild(spanElTeam1);
        var inputElTeam1 = document.createElement("input");
        inputElTeam1.contentEditable = "true";
        inputElTeam1.className = "toreteam" + team1 + " toreinputleft";
        inputElTeam1.size = "2";
        newElMatch.appendChild(inputElTeam1);
        var spanElStopper = document.createElement("span");
        spanElStopper.className = "trenner";
        spanElStopper.innerHTML = ":";
        newElMatch.appendChild(spanElStopper);
        var inputElTeam2 = document.createElement("input");
        inputElTeam2.contentEditable = "true";
        inputElTeam2.className = "toreteam" + team2 + " toreinputright";
        inputElTeam2.size = "2";
        newElMatch.appendChild(inputElTeam2);
        var spanElTeam2 = document.createElement("span");
        spanElTeam2.className = "nameteam" + team2;
        spanElTeam2.innerHTML = getTeamNameById(team2);
        newElMatch.appendChild(spanElTeam2);
        
    return newElMatch;
}

function drawGameplanLbl(text) 
{
    var newEl = document.createElement("div");
    newEl.appendChild(document.createTextNode(""));
    newEl.appendChild(document.createTextNode(text));
    newEl.style.cursor = "pointer";
    newEl.id = "lbl" + text;
    newEl.className = "lbl";    
    return newEl;
}

function getTeamNameById(id) 
{
    return document.getElementById("team" + id).value;
}

function getScorerNameById(id) 
{
    return document.getElementById("scorer" + id).value;
}

function getScorerTeamById(id) {
    return document.getElementById("scorer" + id).previousSibling.value;
}

function getFairPlayNameById(id) 
{
    return document.getElementById("spieler" + id).value;
}

function getNmbrOfTeams() 
{
    return document.getElementById("teamliste").childNodes.length;
}

function getNmbrOfScorers() 
{
    return document.getElementById("torschuetzenliste").childNodes.length;
}

function getNmbrOfFairPlay() 
{
    return document.getElementById("fairplayliste").childNodes.length;
}

function getTeamDataById(id) 
{
    // Array(0-Punkte, 1-Tore, 2-Gegentore, 3-Siege, 4-Unentschieden, 5-Niederlagen, 6-Spiele)
    var out = new Array(0,0,0,0,0,0,0),
        begegnungen = document.getElementsByClassName("toreteam" + id),
        tmpTore,
        tmpGgt;
    for (var i = 0; i < begegnungen.length; i++) 
    {
        if (begegnungen[i].nextSibling.nextSibling) 
        {
            tmpTore = parseInt(begegnungen[i].value);
            tmpGgt = parseInt(begegnungen[i].nextSibling.nextSibling.value);
        }
        else 
        {
            tmpTore = parseInt(begegnungen[i].value);
            tmpGgt = parseInt(begegnungen[i].previousSibling.previousSibling.value);
        }
        if (!isNaN(tmpTore) && !isNaN(tmpGgt)) 
        {
            if (tmpTore == tmpGgt) {
                out[0] += 1;                // zähle Punkte von Team id (unentschieden => +1)
                out[4]++;                   // zähle Unentschieden
            }
            else 
                if (tmpTore > tmpGgt) {
                    out[0] += 3;            // zähle Punkte von Team id (unentschieden => +3)
                    out[3]++;               // zähle Siege
                }
                else {
                    out[5]++;               // zähle Niederlagen
                }
            out[1] += tmpTore;              // zähle Tore
            out[2] += tmpGgt;               // zähle GGT
            out[6]++;                       // zähle gespielte Spiele
        }               
    }
    return out;
}

function initTable() 
{
    var table = document.getElementById("gametable");
    var anz = getNmbrOfTeams();
    for(var i=0; i<anz; i++) 
    {
        var newLine = document.createElement("tr");
        newLine.id = "trteam" + i;
            var newTd = document.createElement("td");
            newTd.className = "tabplatz";
            newTd.innerHTML = (i+1);
            newLine.appendChild(newTd);
            var newTd2 = document.createElement("td");
            newTd2.className = "tabteamname";
            newLine.appendChild(newTd2);
            var newTd3 = document.createElement("td");
            newTd3.className = "tabpunkte";
            newLine.appendChild(newTd3);
            
            var newTd4 = document.createElement("td");
            newTd4.className = "tabspiele";
            newLine.appendChild(newTd4);
            var newTd5 = document.createElement("td");
            newTd5.className = "tabwin";
            newLine.appendChild(newTd5);
            var newTd6 = document.createElement("td");
            newTd6.className = "tabdraw";
            newLine.appendChild(newTd6);
            var newTd7 = document.createElement("td");
            newTd7.className = "tablose";
            newLine.appendChild(newTd7);
                                    
            var newTd8 = document.createElement("td");
            newTd8.className = "tabtore";
            newLine.appendChild(newTd8);
            var newTd9 = document.createElement("td");
            newTd9.className = "tabggt";
            newLine.appendChild(newTd9);
            var newTd10 = document.createElement("td");
            newTd10.className = "tabdiff";
            newLine.appendChild(newTd10); 
        table.appendChild(newLine);                     
    }
    updateTables();
}

function initTorliste() 
{
    var table = document.getElementById("bodytorschuetzen");
    while (table.hasChildNodes()) 
    {
        table.removeChild(table.firstChild);
    }
    var anz = getNmbrOfScorers();
    for (var i = 0; i < anz; i++) 
    {
        var newLine = document.createElement("tr");
        newLine.id = "trtor" + i;
        if (i % 2 === 0) 
            newLine.className = "trrow";
        else 
            newLine.className = "trrow2";
            var newTd = document.createElement("td");
            newTd.className = "tabplatz tabtorplatz";
            newTd.innerHTML = (i + 1);
            newLine.appendChild(newTd);
            var newTd2 = document.createElement("td");
            newTd2.className = "tabteamname tabtorteamname";
            newLine.appendChild(newTd2);
            var newTd3 = document.createElement("td");
            newTd3.className = "tabtorpunkte";
            newLine.appendChild(newTd3);
            table.appendChild(newLine);
    }
}

function initFairPlay() 
{
    var table = document.getElementById("bodyfairplay");
    while (table.hasChildNodes()) 
    {
        table.removeChild(table.firstChild);
    }
    var anz = getNmbrOfFairPlay();
    for (var i = 0; i < anz; i++) 
    {
        var newLine = document.createElement("tr");
        newLine.id = "trfairplay" + i;
        if (i % 2 === 0) 
            newLine.className = "trrow";
        else 
            newLine.className = "trrow2";
            var newTd = document.createElement("td");
            newTd.className = "tabplatz tabfpplatz";
            newTd.innerHTML = (i + 1);
            newLine.appendChild(newTd);
            var newTd2 = document.createElement("td");
            newTd2.className = "tabteamname tabfpteamname";
            newLine.appendChild(newTd2);
            var newTd3 = document.createElement("td");
            newTd3.className = "tabfppunkte";
            newLine.appendChild(newTd3);
            table.appendChild(newLine);
    }
}
                
function updateTables()
{
    var tabname = document.getElementsByClassName("tabteamname");
    var tabpunkte = document.getElementsByClassName("tabpunkte");
    var tabspiele = document.getElementsByClassName("tabspiele");
    var tabwin = document.getElementsByClassName("tabwin");
    var tabdraw = document.getElementsByClassName("tabdraw");
    var tablose = document.getElementsByClassName("tablose");
    var tabtore = document.getElementsByClassName("tabtore");
    var tabggt = document.getElementsByClassName("tabggt");
    var tabdiff = document.getElementsByClassName("tabdiff");
    var data = [];
    var dataOut = [];
    var anz = getNmbrOfTeams();
    for (var k = 0; k < anz; k++) 
    {
        data[k] = getTeamDataById(k);
        dataOut[k] = getTeamDataById(k);
    }
    var zeiger = 0;
    for (var j = 0; j < anz; j++) 
    {
        for (var i = 0; i < anz; i++) // Teste ihn gegen jeden weiteren Wert
        {
            if (data[zeiger][0] < data[i][0]) // Wenn aktueller Wert größer dem Vergleichswert: erneuere Vergleichwert
            {
                zeiger = i; // Update Zeiger auf neue Position des Maximums
            }
            else 
                if (data[zeiger][0] == data[i][0]) // bei Punktegleichstand das Torverhältnis überprüfen
                {
                    if ((data[zeiger][1] - data[zeiger][2]) < (data[i][1] - data[i][2])) 
                    {
                        zeiger = i;
                    }
                    else 
                        if ((data[zeiger][1] - data[zeiger][2]) == (data[i][1] - data[i][2])) // Wenn immer noch gleich, dann geschossene Tore überprüfen
                        {
                            if (data[zeiger][1] < data[i][1]) 
                            {
                                zeiger = i;
                            }
                        }
                }
        }
        data[zeiger][0] = -1; // Lösche den Maximalwert
        tabname[j].innerHTML = getTeamNameById(zeiger);
        tabspiele[j].innerHTML = dataOut[zeiger][6];
        tabwin[j].innerHTML = dataOut[zeiger][3];
        tabdraw[j].innerHTML = dataOut[zeiger][4];
        tablose[j].innerHTML = dataOut[zeiger][5];
        tabpunkte[j].innerHTML = dataOut[zeiger][0];
        tabtore[j].innerHTML = dataOut[zeiger][1];
        tabggt[j].innerHTML = dataOut[zeiger][2];
        tabdiff[j].innerHTML = (dataOut[zeiger][1]-dataOut[zeiger][2]);             
    }
    
    
    //Scorern
    initTorliste();
    var bodytor = document.getElementById("bodytorschuetzen"),
    tabtorname = document.getElementsByClassName("tabtorteamname"),
    tabtorpunkte = document.getElementsByClassName("tabtorpunkte"),
    numOfScorers = getNmbrOfScorers(),
    dataScorers = new Array(numOfScorers),
    dataOutScorers = new Array(numOfScorers),
    row = new Array(numOfScorers);
    //get their goals
    for(var l=0; l<numOfScorers; l++) 
    {
        data[l] = parseInt(document.getElementById("goalsscorer" + l).innerHTML);
        dataOutScorers[l] = data[l];
    }
    //Los geht der Vergleich
    var pointer = 0;
    for (var m = 0; m < numOfScorers; m++) 
    {
        for (var n = 0; n < numOfScorers; n++) // Teste ihn gegen jeden weiteren Wert
        {
            if (data[pointer] < data[n]) // Wenn aktueller Wert größer dem Vergleichswert: erneuere Vergleichwert
            {
                pointer = n; // Update pointer auf neue Position des Maximums
            }
        }
        data[pointer] = -1; // Lösche den Maximalwert
        tabtorname[m].innerHTML = getScorerNameById(pointer) + " (" + getScorerTeamById(pointer) + ")";
        tabtorpunkte[m].innerHTML = dataOutScorers[pointer];
    }
    
    

    //Fair Play
    initFairPlay();
    var tabfpname = document.getElementsByClassName("tabfpteamname"),
    tabfppunkte = document.getElementsByClassName("tabfppunkte"),
    numberOfFairPlay = getNmbrOfFairPlay(),
    dataFairPlay = new Array(numberOfFairPlay),
    dataOutFairPlay = new Array(numberOfFairPlay);
    //get their Cards
    for(var o=0; o<numberOfFairPlay; o++) 
    {                   
        dataFairPlay[o] = (parseInt(document.getElementById("gelb" + o).innerHTML)+parseInt(document.getElementById("gelbrot" + o).innerHTML)*2+parseInt(document.getElementById("rot" + o).innerHTML)*5);
        dataOutFairPlay[o] = dataFairPlay[o];
    }
    //Los geht der Vergleich
    var pointerFairPlay = 0;
    for (var p = 0; p < numberOfFairPlay; p++) 
    {
        for (var q = 0; q < numberOfFairPlay; q++) // Teste ihn gegen jeden weiteren Wert
        {
            if (dataFairPlay[pointerFairPlay] < dataFairPlay[q]) // Wenn aktueller Wert größer dem Vergleichswert: erneuere Vergleichwert
            {
                pointerFairPlay = q; // Update pointerFairPlay auf neue Position des Maximums
            }
        }
        dataFairPlay[pointerFairPlay] = -1; // Lösche den Maximalwert
        tabfpname[p].innerHTML = getFairPlayNameById(pointerFairPlay);
        tabfppunkte[p].innerHTML = dataOutFairPlay[pointerFairPlay];
    }
}

function checkBan(el,color) 
{
    if(color == "gelb") 
    {
        if(el.previousSibling.innerHTML%2 === 0) 
        {
            el.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML = parseInt(el.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML)+1;
        }
    }
    if(color == "gelbrot" ) 
    {
        if(el.previousSibling.previousSibling.previousSibling.innerHTML%2 === 0)
        {
        el.nextSibling.nextSibling.nextSibling.innerHTML = parseInt(el.nextSibling.nextSibling.nextSibling.innerHTML)+1;                        
        }
    }
    if(color == "rot") 
    {
        el.nextSibling.innerHTML = parseInt(el.nextSibling.innerHTML) + 2;
    }
}

function pinBans() 
{
    
}

function navigateTo(id) 
{
    var navi = document.getElementsByClassName("navi");
    var len = navi.length;
    for(var i=0; i<len; i++) navi[i].style.display = "none";
    document.getElementById(id).style.display = "block";
}

/*
 * Sichern/Laden des Status'
 * 
 */  
function save() {               
    
    /* sichere global variables */
    document.getElementById("matchNbr").innerHTML = matchNbr;
    document.getElementById("scorerNbr").innerHTML = scorerNbr;
    document.getElementById("fairPlayNbr").innerHTML = fairPlayNbr;
    document.getElementById("teamNbr").innerHTML = teamNbr;
    
    /* sichere HTML code im localStorage */
    var content = document.getElementsByTagName("body")[0].innerHTML;
    try {
        localStorage.setItem("backup", content);
        notification("Sicherung erstellt :)");
    }
    catch(error) {
        if(error == QUOTA_EXCEEDED_ERR) notification("Kein Speicherplatz im Browser :(");
    } 
}

function load() {
    var body = document.getElementsByTagName("body")[0];
                    
    /* load HTML code from localStorage */
    if(localStorage.getItem("backup")) {
        body.innerHTML = localStorage.getItem("backup");
        notification("Sicherung erfolgreich wiederhergestellt :)");
        clean();                    
        
        /* sichere global variables */
        matchNbr = document.getElementById("matchNbr").innerHTML;
        scorerNbr = document.getElementById("scorerNbr").innerHTML;
        fairPlayNbr = document.getElementById("fairPlayNbr").innerHTML;
        teamNbr = document.getElementById("teamNbr").innerHTML;

        showHide(document.getElementById("navi")); 
        showHide(document.getElementById("loadlink"));
        document.getElementById("savebutton").style.display = "inline-block";  
    }
    else notification("Keine Sicherung vorhanden :(");
}

function clean() {
    localStorage.removeItem("backup");
}

function autoSave(time) {
    /* time = Speicherintervall in Minuten */
    var id = setInterval(save, time*60*1000);
}