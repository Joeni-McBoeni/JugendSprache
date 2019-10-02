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

// ocr-plugin in combination with camera plugin
function onSuccess(imageData) {
      textocr.recText(0, /*3,*/ imageData, onSuccess, onFail); // removed returnType (here 3) from version 2.0.0
      // for sourceType Use 0,1,2,3 or 4
      // for returnType Use 0,1,2 or 3 // 3 returns duplicates[see table]
      function onSuccess(recognizedText) {
            //var element = document.getElementById('pp');
            //element.innerHTML=recognizedText;
            //Use above two lines to show recognizedText in html
            document.getElementById('originalText').value = (recognizedText);
      }
      function onFail(message) {
            alert('Failed because: ' + message);
      }
}
function onFail(message) {
      alert('Failed because: ' + message);
}

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
  ["ausgezeichnet", "lit"],
  ["edel", "dufte"],
  ["Freunde", "Homies"],
  ["Freund", "Homie"],
  ["betrunken", "dicht"],
  ["Menschen", "Dudes"],
  ["Mensch", "Dude"],
  [""]
];
var globalWert = 0;

// Funktion, um Texte zu verjugendlichen
function verjugendlichen(originalText){
  globalWert = 0;
  for(i = 0; i < begriffe.length; i++){
    var pos = originalText.search(new RegExp(begriffe[i][0], "i"));
    while(pos != -1){
      globalWert++;
      var firstPart = originalText.slice(0, pos);
      var lastPart = originalText.slice(pos + begriffe[i][0].length, originalText.length);
      originalText = firstPart + begriffe[i][1] + lastPart;
      pos = originalText.search(new RegExp(begriffe[i][0], "i"));
    }
  }
  return originalText;
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
          // put übersetzterText on db
          // put globalWert * 10 on db
        }
        document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: 'Resultat', originalText: originalText, übersetzterText: übersetzterText}});
        page.querySelector('#push-button-pictureToText').onclick = function() {
          navigator.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true });
        }
      };
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
      var highscore = 0; // get highscore l8er
      if(page.data.points > highscore){
        highscore = page.data.points;
        // set new highscore in local storage
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

/*
var app = {
// Application Constructor
initialize: function() {
document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
},

// deviceready Event Handler
//
// Bind any cordova events here. Common events are:
// 'pause', 'resume', etc.
onDeviceReady: function() {
this.receivedEvent('deviceready');
},

// Update DOM on a Received Event
receivedEvent: function(id) {
var parentElement = document.getElementById(id);
var listeningElement = parentElement.querySelector('.listening');
var receivedElement = parentElement.querySelector('.received');

listeningElement.setAttribute('style', 'display:none;');
receivedElement.setAttribute('style', 'display:block;');

console.log('Received Event: ' + id);
}
};

app.initialize();
*/
