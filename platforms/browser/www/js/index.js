/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// App definieren
var app = {

  // Beim Startup:
  initialize: function() {
    // EventListener hinzufügen
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

    // Begriffe, die später umgewandelt werden, in einen zweidimensionalen Array einfügen
    var begriffe = [
      ["Bruder", "Bro"],
      ["Brüder", "Bros"],
      ["toll", "fresh"],
      ["Hallo", "Yo"],
      ["nett", "nice"],
      ["Vater", "Alter"],
      ["sehr", "voll"],
      ["Trottel", "Lauch"],
      ["Idiot", "Horst"],
      ["ausgezeichnet", "lit"],
      ["edel", "dufte"],
      ["Freunde", "Homies"],
      ["Freund", "Homie"],
      ["betrunken", "dicht"],
      ["Menschen", "Dudes"],
      ["Mensch", "Dude"],
      ["Streit", "Beef"],
      ["stark", "krass"],
      ["langweilig", "wack"],
      ["funktionier", "funz"],
      ["beleidigt", "gedisst"],
      ["beleidig", "diss"],
      ["Verräter", "Snitch"],
      ["peinlich", "cringe"],
      ["großartig", "tight"],
      ["grossartig", "tight"],
      ["nervig", "ätzend"],
      ["nerv", "tilt"],
      ["Honig", "Hummelkotze"],
      ["super", "dope"],
      ["eine Entschuldigung", "ein Sorry"],
      ["die Entschuldigung", "das Sorry"],
      ["Entschuldigung", "Sorry"],
      ["sicher", "fix"],
      ["Asozialer", "Asi"],
      ["asozial", "asi"],
      ["Polizisten", "Bullen"],
      ["Polizist", "Cop"],
      ["Kumpel", "Digi"],
      ["verwirrt", "verpeilt"],
      ["Gruppe", "Crew"],
      ["Musik", "Mucke"],
      ["Anfänger", "Noob"],
      ["verstanden", "gepeilt"],
      ["verstand", "peilte"],
      ["versteh", "peil"],
      ["schön", "geil"],
      ["traurig", "depri"],
      ["Jungen", "Boys"],
      ["Junge", "Boy"],
      ["Mann", "Junge"],
      ["das Mädchen", "das Girl"],
      ["ein Mädchen", "ein Girl"],
      ["Mädchen", "Girls"],
      ["wütend", "aggro"],
      ["Ich bin", "I bims"],
      ["Gentleman", "Ehrenmann"],
      ["Gentlewoman", "Ehrenfrau"],
      ["die Probleme", "den Struggle"],
      ["Probleme", "den Struggle"],
      ["ein Problem", "einen Struggle"],
      ["das Problem", "den Struggle"],
      ["das Problem", "den Struggle"]
    ];

    // Wird für zufäälige Generation & neue Einträge der Datenbank verwendet
    var highestid = 1;

    //Fügt eine neue Aussage zur Datenbank hinzu
    function AddAussagetoDatabase(originalText,uebersetzerText,aussagWert){
      var aussage = {
        id: parseInt(highestid + 1),
        originalText: originalText,
        uebersetzerText: uebersetzerText,
        aussagWert: aussagWert
      };
      firebaseStore.addItem("TAussagen", aussage);
      highestid = GetNewId();
    }

    //Wählt eine zufällige Aussage aus der Datenbank aus und ändert die
    //ensprechenden Elementen ab
    function GetRandomAussage(page){
      var randomId = Math.floor(Math.random() * highestid) + 1;
      firebaseStore.getItems("TAussagen", function(items){
        items.forEach(function(itm){
          if (itm.id == randomId){
            var randomAussage = [itm.originalText,itm.uebersetzerText,itm.aussagWert];
            document.getElementById('jugendtext').innerHTML = randomAussage[1];
            page.querySelector('#push-button-confirm').onclick = function() {
              if(document.getElementById('translatedText').value.trim() == randomAussage[0].trim()){
                var punkteString = document.getElementById('punkte').innerHTML;
                var punkte = parseInt(punkteString.slice(8, punkteString.length));
                punkte += parseInt(randomAussage[2]);
                document.getElementById('punkte').innerHTML = "Punkte: " + punkte.toString();
                // get new prompt from db
              } else {
                var lebenString = document.getElementById('leben').innerHTML;
                var leben = parseInt(lebenString.slice(10, 11));
                leben--;
                if(leben == 0){
                  var punkteString = document.getElementById('punkte').innerHTML;
                  var punkte = parseInt(punkteString.slice(8, punkteString.length));
                  document.querySelector('#myNavigator').pushPage('page6.html', {data: {title: 'Verloren!', points: punkte}});
                } else {
                  document.getElementById('leben').innerHTML = "Versuche: " + leben.toString();
                }
              };
              GetRandomAussage(page);
            };
          }
        });
      });
    }

    //Muss so sein, weil es eine live datenbank ist
    function NextAussage(){}

    //Die grösste ID  wird +1 ausgegeben
    function GetNewId(){
      firebaseStore.getItems("TAussagen", function(items){
        items.forEach(function(itm){
          highestid = itm.id;
        });
      });
    }

    // Funktion, um Texte zu verjugendlichen
    function verjugendlichen(originalText){
      var wortWert = 0;
      // geht alle Begriffe durch
      for(i = 0; i < begriffe.length; i++){
        // Durchsucht den Original-Text nach dem Begriff
        var pos = originalText.search(new RegExp(begriffe[i][0], "i"));
        while(pos != -1){
          // erhöht Ratespiel-Punktzahl
          wortWert++;
          // Nimmt den alten Begriff aus dem String und fügt den neuen ein
          var firstPart = originalText.slice(0, pos);
          var lastPart = originalText.slice(pos + begriffe[i][0].length, originalText.length);
          originalText = firstPart + begriffe[i][1] + lastPart;
          // Durchsucht erneut
          pos = originalText.search(new RegExp(begriffe[i][0], "i"));
        }
      }
      // Gibt den neuen Text und die Ratespiel-Punktzahl zurück
      return [originalText, wortWert * 10];
    }

    // OnsenUI Page listener
    document.addEventListener('init', function(event) {
      var page = event.target;
      // Verschiedene Seiten mit dem EventListener ausstatten
      switch(page.id){
        // Startbildschirm
        case 'page1':
        // Holt die höchste ID aus der Datenbank, damit man neue immer am Ende hinzufügt
        highestid = GetNewId();
        // Wechselt auf page2
        page.querySelector('#push-button-translator').onclick = function() {
          document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Übersetzer'}});
        };
        // Wechselt auf page4
        page.querySelector('#push-button-game').onclick = function() {
          document.querySelector('#myNavigator').pushPage('page4.html', {data: {title: 'Anleitung'}});
        };
        break;
        // Screen zum Bild hochladen & Text eingeben
        case 'page2':
        // Fügt den Titel ein
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        page.querySelector('#push-button-confirm').onclick = function() {
          // "Verjugendlicht" den eingegebenen Text
          var originalText = document.getElementById('originalText').value;
          var übersetzterText = verjugendlichen(originalText);
          // Wenn der User zustimmt, seine Daten zu teilen...
          if(permissionCheckbox.checked == true){
            // ... werden die Texte (original & verjugendlicht) & ihr Wortwert auf die Datenbank geladen
            AddAussagetoDatabase(originalText,übersetzterText[0],übersetzterText[1]);
          }
          document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: 'Resultat', originalText: originalText, übersetzterText: übersetzterText[0]}});
        }
        // Wechselt auf page2_extra (Optionenauswahl für Kamera)
        page.querySelector('#push-button-pictureToText').onclick = function() {
          document.querySelector('#myNavigator').pushPage('page2_extra.html', {data: {title: 'Bild zu Text umwandeln'}});
        }
        break;
        // Kamera- oder Galerie-Auswahlsscreen
        // Wäre ein ons-dialog, wenn es nach mir gänge, allerdings hat das nicht zusammen mit dem navigator funktioniert. Darum neue ons-page ausserhalb der regulären Nummerierung.
        case 'page2_extra':
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        page.querySelector('#useCamera').onclick = function() {
          navigator.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true});
          function onSuccess(imageData) {
            textocr.recText(0, imageData, onSuccess, onFail);
            function onSuccess(recognizedText) {
              var originalText = "";
              for (var i = 0; i < recognizedText.words.wordtext.length; i++){
                originalText += recognizedText.words.wordtext[i] + " ";
              }
              document.getElementById('originalText').value = originalText;
              popPage();
            }
            function onFail(message) {
              alert('Fehler: ' + message);
            }
          }
          function onFail(message) {
            alert('Fehler: ' + message);
          }
        }
        page.querySelector('#useGallery').onclick = function() {
          navigator.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true, sourceType:Camera.PictureSourceType.SAVEDPHOTOALBUM});
          function onSuccess(imageData) {
            textocr.recText(0, imageData, onSuccess, onFail);
            function onSuccess(recognizedText) {
              var originalText = "";
              for (var i = 0; i < recognizedText.words.wordtext.length; i++){
                originalText += recognizedText.words.wordtext[i] + " ";
              }
              document.getElementById('originalText').value = originalText;
              popPage();
            }
            function onFail(message) {
              alert('Fehler: ' + message);
            }
          }
          function onFail(message) {
            alert('Fehler: ' + message);
          }
        }
        break;
        // Resultatsscreen
        case 'page3':
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        page.querySelector('.resultOutput').innerHTML = page.data.übersetzterText;
        page.querySelector('.resultInput').innerHTML = page.data.originalText;
        break;
        // Ratespiel Anleitungsscreen
        case 'page4':
        if(page.data.title == 'Neues Spiel'){
          document.querySelector('#myNavigator').pushPage('page5.html', {data: {title: 'Spiel'}});
        }
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        page.querySelector('#push-button-confirm').onclick = function() {
          document.querySelector('#myNavigator').pushPage('page5.html', {data: {title: 'Spiel'}});
        };
        break;
        // Screen für das Ratespiel selbst
        case 'page5':
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        page.querySelector('ons-back-button').onClick = function(event) {
          document.querySelector('ons-navigator').resetToPage('page1.html', {pop: true});
        };
        GetRandomAussage(page);
        break;
        case 'page6':
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        page.querySelector('.ownScore').innerHTML = "Erreichte Punkte: " + page.data.points;
        hiScoreStorage = localStorage;
        var highscore = hiScoreStorage.getItem('myHighScore');
        if(highscore == null){
          highscore = 0;
        }
        if(page.data.points > highscore){
          highscore = page.data.points;
          hiScoreStorage.setItem('myHighScore', highscore);
        }
        page.querySelector('.hiScore').innerHTML = "Highscore: " + highscore;
        page.querySelector('#push-button-again').onclick = function() {
          // Nicht page5, da dann der Back-Button fehlt, deshalb zuerst auf page4, welche dann automatisch weiterleitet
          // popPage error ist beabsichtigt, weil so page4 nicht richtig lädt, d.h. es lädt direkt page5
          document.querySelector('ons-navigator').resetToPage('page4.html', {pop: true, data: {title: 'Neues Spiel'}});
        };
        page.querySelector('#push-button-home').onclick = function() {
          document.querySelector('ons-navigator').resetToPage('page1.html', {pop: true});
        };
        break;
      };
    });
  },

  // Diese Funktion wird gecallt & führt dann noch nebenbei etwas aus. Deshalb muss sie existieren, obwohl sie selbst nichts tut.
  onDeviceReady: function() {}
}

app.initialize();
