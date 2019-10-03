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

var app = {

  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

    // Begriffe
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
      ["bin", "bims"],
      ["Gentleman", "Ehrenmann"],
      ["Gentlewoman", "Ehrenfrau"]
    ];

    // Funktion, um Texte zu verjugendlichen
    function verjugendlichen(originalText){
      var wortWert = 0;
      for(i = 0; i < begriffe.length; i++){
        var pos = originalText.search(new RegExp(begriffe[i][0], "i"));
        while(pos != -1){
          wortWert++;
          var firstPart = originalText.slice(0, pos);
          var lastPart = originalText.slice(pos + begriffe[i][0].length, originalText.length);
          originalText = firstPart + begriffe[i][1] + lastPart;
          pos = originalText.search(new RegExp(begriffe[i][0], "i"));
        }
      }
      console.log(wortWert * 10);
      return [originalText, wortWert * 10];
    }

    // OnsenUI Page listener
    document.addEventListener('init', function(event) {
      var page = event.target;
      switch(page.id){
        case 'page1':
          page.querySelector('#push-button-translator').onclick = function() {
            document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Übersetzer'}});
          };
          page.querySelector('#push-button-game').onclick = function() {
            document.querySelector('#myNavigator').pushPage('page4.html', {data: {title: 'Anleitung'}});
          };
        break;
        case 'page2':
          page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
          page.querySelector('#push-button-confirm').onclick = function() {
            var originalText = document.getElementById('originalText').value;
            var übersetzterText = verjugendlichen(originalText);
            if(permissionCheckbox.checked == true){
              // put übersetzterText[0] on db
              // put übersetzterText[1] (wortWert * 10) on db
            }
            document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: 'Resultat', originalText: originalText, übersetzterText: übersetzterText[0]}});
          }
          page.querySelector('#push-button-pictureToText').onclick = function() {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true});
            function onSuccess(imageData) {
              textocr.recText(0, /*3,*/ imageData, onSuccess, onFail); // removed returnType (here 3) from version 2.0.0
              function onSuccess(recognizedText) {
                var originalText = "";
                for (var i = 0; i < recognizedText.words.wordtext.length; i++){
                  originalText += recognizedText.words.wordtext[i] + " ";
                }

                document.getElementById('originalText').value = originalText;
              }
              function onFail(message) {
                alert('Failed because: ' + message);
              }
            }
            function onFail(message) {
              alert('Failed because: ' + message);
            }
          }
        break;
        case 'page3':
          page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
          page.querySelector('.resultOutput').innerHTML = page.data.übersetzterText;
          page.querySelector('.resultInput').innerHTML = page.data.originalText;
          break;
          case 'page4':
          if(page.data.title == 'Neues Spiel'){
            document.querySelector('#myNavigator').pushPage('page5.html', {data: {title: 'Spiel'}});
          }
          page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
          page.querySelector('#push-button-confirm').onclick = function() {
            document.querySelector('#myNavigator').pushPage('page5.html', {data: {title: 'Spiel'}});
          };
        break;
        case 'page5':
          page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
          page.querySelector('ons-back-button').onClick = function(event) {
            document.querySelector('ons-navigator').resetToPage('page1.html', {pop: true});
          };
          page.querySelector('#push-button-confirm').onclick = function() {
            var prompt = "Bruder, unser Vater ist sehr toll und nett."; // get from db
            var promptValue = 40; // get from db
            if(document.getElementById('translatedText').value.trim() == prompt){ // add db later
              var punkteString = document.getElementById('punkte').innerHTML;
              var punkte = parseInt(punkteString.slice(8, punkteString.length));
              punkte += promptValue;
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
          };
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

  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },
  receivedEvent: function(id) {
  }
}

app.initialize();
