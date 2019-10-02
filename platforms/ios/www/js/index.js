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

//Begriffe (put in different js later)
var begriffe = [
  ["Bruder", "Bro"],
  ["toll", "fresh"],
  ["Hallo", "Yo"],
  ["nett", "nice"],
  ["Freund", "Alter"],
  ["sehr", "voll"],
  ["Trottel", "Lauch"],
  ["ausgezeichnet", "lit"],
  ["edel", "dufte"],
  ["Gruppe", "Squad"]
];

// Funktion, um Texte zu verjugendlichen
function verjugendlichen(originalText){
  for(i = 0; i < begriffe.length; i++){
    var pos = originalText.search(new RegExp(begriffe[i][0], "i"));
    while(pos != -1){
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

  if (page.id === 'page1') {
    page.querySelector('#push-button-translator').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Übersetzer'}});
    };
    page.querySelector('#push-button-game').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page4.html', {data: {title: 'Anleitung'}});
    };
  }
  else if (page.id === 'page2') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('#push-button-confirm').onclick = function() {
      var originalText = document.getElementById('originalText').value;
      var übersetzterText = verjugendlichen(originalText);
      document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: 'Resultat', originalText: originalText, übersetzterText: übersetzterText}});
    };
  }
  else if (page.id === 'page3') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('.resultOutput').innerHTML = page.data.übersetzterText;
    page.querySelector('.resultInput').innerHTML = page.data.originalText;
  }
  else if (page.id === 'page4') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('#push-button-confirm').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page5.html', {data: {title: 'Spiel'}});
    };
  }
  else if (page.id === 'page5') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('ons-back-button').onClick = function(event) {
      document.querySelector('ons-navigator').resetToPage('page1.html', {pop: true});
    };
    page.querySelector('#push-button-confirm').onclick = function() {
      var prompt = "Bruder, mein Freund ist sehr toll und nett."; // get from db
      if(document.getElementById('translatedText').value.trim() == prompt){ // add db later
        var punkteString = document.getElementById('punkte').innerHTML;
        var punkte = parseInt(punkteString.slice(8, punkteString.length));
        punkte += 10;
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
  }
  else if (page.id === 'page6') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    page.querySelector('.ownScore').innerHTML = "Erreichte Punkte: " + page.data.points;
    var highscore = 0; // get highscore l8er
    if(page.data.points > highscore){
      highscore = page.data.points;
      // set new highscore in local storage
    }
    page.querySelector('.hiScore').innerHTML = "Highscore: " + highscore;
    page.querySelector('#push-button-again').onclick = function() {
      document.querySelector('ons-navigator').resetToPage('page5.html', {pop: true, data: {title: 'Spiel'}});
    };
    page.querySelector('#push-button-home').onclick = function() {
      document.querySelector('ons-navigator').resetToPage('page1.html', {pop: true});
    };
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
